#!/usr/bin/env python3
"""
Autotask Web API Server
Flask backend that wraps the Autotask MCP functionality for web frontend access
"""

import os
import json
import httpx
from datetime import datetime, date
from typing import Optional, Dict, Any, List
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Configuration
AUTOTASK_USERNAME = os.getenv("AUTOTASK_USERNAME", "")
AUTOTASK_SECRET = os.getenv("AUTOTASK_SECRET", "")
AUTOTASK_INTEGRATION_CODE = os.getenv("AUTOTASK_INTEGRATION_CODE", "")
AUTOTASK_API_URL = os.getenv("AUTOTASK_API_URL", "https://webservices.autotask.net/ATServicesRest/v1.0")

API_TIMEOUT = 30.0
MAX_PAGE_SIZE = 500


def _get_headers() -> Dict[str, str]:
    """Get authentication headers for Autotask API requests."""
    return {
        "ApiIntegrationcode": AUTOTASK_INTEGRATION_CODE,
        "UserName": AUTOTASK_USERNAME,
        "Secret": AUTOTASK_SECRET,
        "Content-Type": "application/json"
    }


def _validate_config() -> tuple[bool, str]:
    """Validate that required configuration is present."""
    if not AUTOTASK_USERNAME:
        return False, "AUTOTASK_USERNAME environment variable not set"
    if not AUTOTASK_SECRET:
        return False, "AUTOTASK_SECRET environment variable not set"
    if not AUTOTASK_INTEGRATION_CODE:
        return False, "AUTOTASK_INTEGRATION_CODE environment variable not set"
    return True, ""


def _handle_api_error(e: Exception) -> Dict[str, Any]:
    """Consistent error formatting across all endpoints."""
    if isinstance(e, httpx.HTTPStatusError):
        error_body = ""
        try:
            error_body = e.response.json()
            if isinstance(error_body, dict) and "errors" in error_body:
                errors = error_body["errors"]
                if errors and len(errors) > 0:
                    return {"error": errors[0].get("message", "API request failed"), "status": e.response.status_code}
        except:
            pass

        if e.response.status_code == 400:
            return {"error": f"Bad request. {error_body if error_body else 'Please check your input parameters.'}", "status": 400}
        elif e.response.status_code == 401:
            return {"error": "Authentication failed. Please check your Autotask credentials.", "status": 401}
        elif e.response.status_code == 403:
            return {"error": "Permission denied. You don't have access to this resource.", "status": 403}
        elif e.response.status_code == 404:
            return {"error": "Resource not found. Please check the ID is correct.", "status": 404}
        elif e.response.status_code == 429:
            return {"error": "Rate limit exceeded. Please wait before making more requests.", "status": 429}
        return {"error": f"API request failed with status {e.response.status_code}", "status": e.response.status_code}
    elif isinstance(e, httpx.TimeoutException):
        return {"error": "Request timed out. Please try again.", "status": 408}
    return {"error": f"Unexpected error occurred: {str(e)}", "status": 500}


def _make_api_request(
    method: str,
    endpoint: str,
    data: Optional[Dict[str, Any]] = None,
    params: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """Make a synchronous authenticated API request to Autotask."""
    is_valid, error_msg = _validate_config()
    if not is_valid:
        raise ValueError(error_msg)

    url = f"{AUTOTASK_API_URL}/{endpoint}"
    headers = _get_headers()

    with httpx.Client(timeout=API_TIMEOUT) as client:
        if method.upper() == "GET":
            response = client.get(url, headers=headers, params=params)
        elif method.upper() == "POST":
            response = client.post(url, headers=headers, json=data)
        elif method.upper() == "PATCH":
            response = client.patch(url, headers=headers, json=data)
        elif method.upper() == "DELETE":
            response = client.delete(url, headers=headers)
        else:
            raise ValueError(f"Unsupported HTTP method: {method}")

        response.raise_for_status()
        return response.json()


# Lookup Functions

def _lookup_company_id(company_name: str) -> Optional[int]:
    """Lookup a company ID by name."""
    try:
        query_body = {
            "MaxRecords": 5,
            "filter": [{"field": "companyName", "op": "contains", "value": company_name}]
        }

        result = _make_api_request("POST", "Companies/query", data=query_body)
        companies = result.get("items", [])

        if not companies:
            return None

        for company in companies:
            if company.get("companyName", "").lower() == company_name.lower():
                return company.get("id")

        return companies[0].get("id")
    except:
        return None


def _lookup_resource_id(resource_name: Optional[str] = None, resource_email: Optional[str] = None) -> Optional[int]:
    """Lookup a resource (user) ID by name or email."""
    try:
        filters = []

        if resource_email:
            filters.append({"field": "email", "op": "eq", "value": resource_email})
        elif resource_name:
            name_parts = resource_name.strip().split(None, 1)
            if len(name_parts) == 2:
                filters.append({"field": "firstName", "op": "contains", "value": name_parts[0]})
                filters.append({"field": "lastName", "op": "contains", "value": name_parts[1]})
            else:
                filters.append({
                    "op": "or",
                    "items": [
                        {"field": "firstName", "op": "contains", "value": resource_name},
                        {"field": "lastName", "op": "contains", "value": resource_name}
                    ]
                })
        else:
            return None

        query_body = {
            "MaxRecords": 5,
            "filter": filters if len(filters) == 1 else [{"op": "and", "items": filters}]
        }

        result = _make_api_request("POST", "Resources/query", data=query_body)
        resources = result.get("items", [])

        if not resources:
            return None

        return resources[0].get("id")
    except:
        return None


def _lookup_contact_id(
    contact_email: Optional[str] = None,
    contact_name: Optional[str] = None,
    company_id: Optional[int] = None
) -> Optional[int]:
    """Lookup a contact ID by email or name."""
    try:
        filters = []

        if contact_email:
            filters.append({"field": "emailAddress", "op": "eq", "value": contact_email})
        elif contact_name:
            name_parts = contact_name.strip().split(None, 1)
            if len(name_parts) == 2:
                filters.append({"field": "firstName", "op": "contains", "value": name_parts[0]})
                filters.append({"field": "lastName", "op": "contains", "value": name_parts[1]})
            else:
                filters.append({
                    "op": "or",
                    "items": [
                        {"field": "firstName", "op": "contains", "value": contact_name},
                        {"field": "lastName", "op": "contains", "value": contact_name}
                    ]
                })

        if company_id:
            filters.append({"field": "companyID", "op": "eq", "value": company_id})

        if not filters:
            return None

        query_body = {
            "MaxRecords": 5,
            "filter": filters if len(filters) == 1 else [{"op": "and", "items": filters}]
        }

        result = _make_api_request("POST", "Contacts/query", data=query_body)
        contacts = result.get("items", [])

        if not contacts:
            return None

        return contacts[0].get("id")
    except:
        return None


# API Endpoints

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    is_valid, error_msg = _validate_config()
    return jsonify({
        "status": "healthy" if is_valid else "unhealthy",
        "message": error_msg if not is_valid else "API is running",
        "configured": is_valid
    })


@app.route('/api/tickets/search', methods=['POST'])
def search_tickets():
    """Search for tickets with filters."""
    try:
        data = request.json or {}

        filters = []
        if data.get('company_id'):
            filters.append({"field": "companyID", "op": "eq", "value": data['company_id']})
        if data.get('status') is not None:
            filters.append({"field": "status", "op": "eq", "value": data['status']})
        if data.get('assigned_resource_id'):
            filters.append({"field": "assignedResourceID", "op": "eq", "value": data['assigned_resource_id']})
        if data.get('queue_id'):
            filters.append({"field": "queueID", "op": "eq", "value": data['queue_id']})

        query_body = {
            "MaxRecords": data.get('limit', 20)
        }

        if filters:
            if len(filters) == 1:
                query_body["filter"] = filters
            else:
                query_body["filter"] = [{"op": "and", "items": filters}]
        else:
            query_body["filter"] = [{"op": "exist", "field": "id"}]

        result = _make_api_request("POST", "Tickets/query", data=query_body)
        tickets = result.get("items", [])

        return jsonify({
            "success": True,
            "total": len(tickets),
            "tickets": tickets,
            "limit": data.get('limit', 20)
        })

    except Exception as e:
        return jsonify(_handle_api_error(e)), 500


@app.route('/api/tickets/<int:ticket_id>', methods=['GET'])
def get_ticket(ticket_id):
    """Get a single ticket by ID."""
    try:
        result = _make_api_request("GET", f"Tickets/{ticket_id}")
        ticket = result.get("item", {})

        return jsonify({
            "success": True,
            "ticket": ticket
        })

    except Exception as e:
        return jsonify(_handle_api_error(e)), 500


@app.route('/api/tickets', methods=['POST'])
def create_ticket():
    """Create a new ticket."""
    try:
        data = request.json

        # Resolve company ID
        company_id = data.get('company_id')
        if not company_id and data.get('company_name'):
            company_id = _lookup_company_id(data['company_name'])
            if not company_id:
                return jsonify({"error": f"Could not find company '{data['company_name']}'"}), 404

        if not company_id:
            return jsonify({"error": "Either company_id or company_name must be provided"}), 400

        # Build ticket data
        ticket_data = {
            "companyID": company_id,
            "title": data['title'],
            "description": data['description'],
            "priority": data.get('priority', 2),
            "status": data.get('status', 1)
        }

        # Resolve contact ID if provided
        if data.get('contact_id'):
            ticket_data["contactID"] = data['contact_id']
        elif data.get('contact_email') or data.get('contact_name'):
            contact_id = _lookup_contact_id(
                contact_email=data.get('contact_email'),
                contact_name=data.get('contact_name'),
                company_id=company_id
            )
            if contact_id:
                ticket_data["contactID"] = contact_id

        # Resolve assigned resource ID if provided
        if data.get('assigned_resource_id'):
            ticket_data["assignedResourceID"] = data['assigned_resource_id']
        elif data.get('assigned_resource_name') or data.get('assigned_resource_email'):
            resource_id = _lookup_resource_id(
                resource_name=data.get('assigned_resource_name'),
                resource_email=data.get('assigned_resource_email')
            )
            if resource_id:
                ticket_data["assignedResourceID"] = resource_id

        # Add optional fields
        if data.get('queue_id'):
            ticket_data["queueID"] = data['queue_id']
        if data.get('due_date_time'):
            ticket_data["dueDateTime"] = data['due_date_time']
        if data.get('issue_type'):
            ticket_data["issueType"] = data['issue_type']
        if data.get('sub_issue_type'):
            ticket_data["subIssueType"] = data['sub_issue_type']

        result = _make_api_request("POST", "Tickets", data=ticket_data)

        return jsonify({
            "success": True,
            "ticket_id": result.get('itemId'),
            "result": result
        })

    except Exception as e:
        return jsonify(_handle_api_error(e)), 500


@app.route('/api/tickets/<int:ticket_id>', methods=['PATCH'])
def update_ticket(ticket_id):
    """Update an existing ticket."""
    try:
        data = request.json
        update_data = {"id": ticket_id}

        if data.get('title'):
            update_data["title"] = data['title']
        if data.get('description'):
            update_data["description"] = data['description']
        if data.get('status') is not None:
            update_data["status"] = data['status']
        if data.get('priority') is not None:
            update_data["priority"] = data['priority']
        if data.get('assigned_resource_id'):
            update_data["assignedResourceID"] = data['assigned_resource_id']
        if data.get('queue_id'):
            update_data["queueID"] = data['queue_id']

        if len(update_data) == 1:
            return jsonify({"error": "No fields specified to update"}), 400

        result = _make_api_request("PATCH", "Tickets", data=update_data)

        return jsonify({
            "success": True,
            "ticket_id": ticket_id,
            "result": result
        })

    except Exception as e:
        return jsonify(_handle_api_error(e)), 500


@app.route('/api/companies/search', methods=['POST'])
def search_companies():
    """Search for companies."""
    try:
        data = request.json or {}

        query_body = {
            "MaxRecords": data.get('limit', 20)
        }

        if data.get('company_name'):
            query_body["filter"] = [{"field": "companyName", "op": "contains", "value": data['company_name']}]
        else:
            query_body["filter"] = [{"op": "exist", "field": "id"}]

        result = _make_api_request("POST", "Companies/query", data=query_body)
        companies = result.get("items", [])

        return jsonify({
            "success": True,
            "total": len(companies),
            "companies": companies,
            "limit": data.get('limit', 20)
        })

    except Exception as e:
        return jsonify(_handle_api_error(e)), 500


@app.route('/api/companies/<int:company_id>', methods=['GET'])
def get_company(company_id):
    """Get a single company by ID."""
    try:
        result = _make_api_request("GET", f"Companies/{company_id}")
        company = result.get("item", {})

        return jsonify({
            "success": True,
            "company": company
        })

    except Exception as e:
        return jsonify(_handle_api_error(e)), 500


@app.route('/api/contacts/search', methods=['POST'])
def search_contacts():
    """Search for contacts."""
    try:
        data = request.json or {}

        filters = []
        if data.get('company_id'):
            filters.append({"field": "companyID", "op": "eq", "value": data['company_id']})
        if data.get('email'):
            filters.append({"field": "emailAddress", "op": "contains", "value": data['email']})
        if data.get('first_name'):
            filters.append({"field": "firstName", "op": "contains", "value": data['first_name']})
        if data.get('last_name'):
            filters.append({"field": "lastName", "op": "contains", "value": data['last_name']})

        query_body = {
            "MaxRecords": data.get('limit', 20)
        }

        if filters:
            if len(filters) == 1:
                query_body["filter"] = filters
            else:
                query_body["filter"] = [{"op": "and", "items": filters}]
        else:
            query_body["filter"] = [{"op": "exist", "field": "id"}]

        result = _make_api_request("POST", "Contacts/query", data=query_body)
        contacts = result.get("items", [])

        return jsonify({
            "success": True,
            "total": len(contacts),
            "contacts": contacts,
            "limit": data.get('limit', 20)
        })

    except Exception as e:
        return jsonify(_handle_api_error(e)), 500


@app.route('/api/resources/search', methods=['POST'])
def search_resources():
    """Search for resources (users)."""
    try:
        data = request.json or {}

        filters = []

        if data.get('email'):
            filters.append({"field": "email", "op": "eq", "value": data['email']})
        if data.get('first_name'):
            filters.append({"field": "firstName", "op": "contains", "value": data['first_name']})
        if data.get('last_name'):
            filters.append({"field": "lastName", "op": "contains", "value": data['last_name']})
        if data.get('user_name'):
            filters.append({"field": "userName", "op": "contains", "value": data['user_name']})
        if data.get('active_only', True):
            filters.append({"field": "active", "op": "eq", "value": True})

        query_body = {
            "MaxRecords": data.get('limit', 20)
        }

        if filters:
            if len(filters) == 1:
                query_body["filter"] = filters
            else:
                query_body["filter"] = [{"op": "and", "items": filters}]
        else:
            query_body["filter"] = [{"op": "exist", "field": "id"}]

        result = _make_api_request("POST", "Resources/query", data=query_body)
        resources = result.get("items", [])

        return jsonify({
            "success": True,
            "total": len(resources),
            "resources": resources,
            "limit": data.get('limit', 20)
        })

    except Exception as e:
        return jsonify(_handle_api_error(e)), 500


@app.route('/api/tickets/<int:ticket_id>/notes', methods=['POST'])
def add_ticket_note(ticket_id):
    """Add a note to a ticket."""
    try:
        data = request.json

        note_data = {
            "ticketID": ticket_id,
            "title": data['title'],
            "description": data['description'],
            "noteType": data.get('note_type', 1),
            "publish": data.get('publish', 1)
        }

        result = _make_api_request("POST", "TicketNotes", data=note_data)

        return jsonify({
            "success": True,
            "note_id": result.get('itemId'),
            "result": result
        })

    except Exception as e:
        return jsonify(_handle_api_error(e)), 500


@app.route('/api/time-entries', methods=['POST'])
def create_time_entry():
    """Create a time entry."""
    try:
        data = request.json

        # Resolve resource ID
        resource_id = data.get('resource_id')
        if not resource_id and (data.get('resource_name') or data.get('resource_email')):
            resource_id = _lookup_resource_id(
                resource_name=data.get('resource_name'),
                resource_email=data.get('resource_email')
            )
            if not resource_id:
                search_term = data.get('resource_email') or data.get('resource_name')
                return jsonify({"error": f"Could not find resource '{search_term}'"}), 404

        if not resource_id:
            return jsonify({"error": "Either resource_id, resource_name, or resource_email must be provided"}), 400

        # Use today's date if not specified
        date_worked = data.get('date_worked')
        if not date_worked:
            date_worked = date.today().strftime("%Y-%m-%d")

        # Build time entry data
        time_entry_data = {
            "ticketID": data['ticket_id'],
            "resourceID": resource_id,
            "dateWorked": date_worked,
            "hoursWorked": data['hours_worked'],
            "timeEntryType": data.get('time_entry_type', 1),
            "offsetHours": data.get('offset_hours', 0.0)
        }

        if data.get('summary_notes'):
            time_entry_data["summaryNotes"] = data['summary_notes']

        if data.get('internal_notes'):
            time_entry_data["internalNotes"] = data['internal_notes']

        if data.get('hours_to_bill') is not None:
            time_entry_data["hoursToBill"] = data['hours_to_bill']
        else:
            time_entry_data["hoursToBill"] = data['hours_worked']

        result = _make_api_request("POST", "TimeEntries", data=time_entry_data)

        return jsonify({
            "success": True,
            "time_entry_id": result.get('itemId'),
            "result": result
        })

    except Exception as e:
        return jsonify(_handle_api_error(e)), 500


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('DEBUG', 'False').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug)
