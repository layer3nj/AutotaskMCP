# Autotask Web Frontend

A modern web-based interface for managing Autotask tickets, companies, contacts, and resources. Built with React, Vite, and Tailwind CSS.

## Features

### ✨ Core Features
- **Dashboard**: Overview of tickets and quick stats
- **Ticket Management**: Create, view, search, and update tickets
- **Company Management**: Search and view company information
- **Contact Management**: Search and view contacts
- **Resource Management**: Search and view user resources
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

### 🎨 User Interface
- Modern, clean design with Tailwind CSS
- Intuitive navigation with sidebar and mobile menu
- Loading states and error handling
- Form validation and user feedback
- Priority badges and status indicators

## Architecture

### Frontend (React + Vite)
```
frontend/
├── src/
│   ├── components/        # Reusable UI components
│   │   └── Layout.jsx    # Main layout with navigation
│   ├── pages/            # Page components
│   │   ├── Dashboard.jsx
│   │   ├── TicketsPage.jsx
│   │   ├── TicketDetailPage.jsx
│   │   ├── CreateTicketPage.jsx
│   │   ├── CompaniesPage.jsx
│   │   ├── ContactsPage.jsx
│   │   └── ResourcesPage.jsx
│   ├── services/         # API integration
│   │   └── api.js        # Axios API client
│   ├── App.jsx           # Main app with routing
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

### Backend (Flask API)
```
backend/
├── api_server.py         # Flask REST API server
├── requirements.txt      # Python dependencies
└── .env.example          # Environment variables template
```

## Installation

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+
- Autotask API credentials

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your Autotask credentials:
   ```
   AUTOTASK_USERNAME=your-username@company.com
   AUTOTASK_SECRET=your-api-secret-here
   AUTOTASK_INTEGRATION_CODE=your-integration-code-here
   AUTOTASK_API_URL=https://webservices5.autotask.net/ATServicesRest/v1.0
   PORT=5000
   ```

4. **Start the backend server**:
   ```bash
   python api_server.py
   ```

   The API server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment (optional)**:
   ```bash
   cp .env.example .env
   ```

   The default API URL is `http://localhost:5000/api`

4. **Start the development server**:
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:3000`

5. **Open your browser**:
   Navigate to `http://localhost:3000`

## Usage

### Dashboard
- View API connection status
- See recent tickets
- Quick access to all sections
- Create new tickets

### Tickets
- **Search**: Filter by company, status, assigned resource, and more
- **View**: See detailed ticket information including description, priority, status
- **Create**: Create new tickets with company lookup by name or ID
- **Update**: Add notes to tickets
- **Priority Badges**: Visual indicators for Low, Medium, High, Critical

### Companies
- Search by company name
- View company details including contact information

### Contacts
- Search by company, email, name
- View contact details and associated company

### Resources
- Search by email, name, username
- Filter active/inactive users
- View resource details

## API Endpoints

### Health Check
```
GET /api/health
```

### Tickets
```
POST /api/tickets/search          # Search tickets
GET  /api/tickets/:id             # Get ticket details
POST /api/tickets                 # Create ticket
PATCH /api/tickets/:id            # Update ticket
POST /api/tickets/:id/notes       # Add note to ticket
```

### Companies
```
POST /api/companies/search        # Search companies
GET  /api/companies/:id           # Get company details
```

### Contacts
```
POST /api/contacts/search         # Search contacts
```

### Resources
```
POST /api/resources/search        # Search resources
```

### Time Entries
```
POST /api/time-entries            # Create time entry
```

## Development

### Frontend Development
```bash
cd frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend Development
```bash
cd backend
DEBUG=True python api_server.py    # Run with debug mode
```

## Building for Production

### Frontend
```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/`

### Backend
The Flask backend can be deployed using:
- Gunicorn: `gunicorn api_server:app`
- uWSGI
- Docker container

## Environment Variables

### Backend
- `AUTOTASK_USERNAME`: Autotask API username
- `AUTOTASK_SECRET`: Autotask API secret
- `AUTOTASK_INTEGRATION_CODE`: Autotask integration code
- `AUTOTASK_API_URL`: Autotask API base URL
- `PORT`: Server port (default: 5000)
- `DEBUG`: Enable debug mode (default: False)

### Frontend
- `VITE_API_URL`: Backend API URL (default: http://localhost:5000/api)

## Troubleshooting

### Backend Issues

**"Authentication failed"**
- Verify credentials in `.env` file
- Check for extra spaces in environment variables
- Ensure API user has proper security level in Autotask

**"CORS errors"**
- Backend has CORS enabled by default
- Check that frontend is making requests to correct API URL

### Frontend Issues

**"Cannot connect to API"**
- Ensure backend server is running on port 5000
- Check `VITE_API_URL` in frontend `.env`
- Verify proxy configuration in `vite.config.js`

**"Build errors"**
- Delete `node_modules` and run `npm install` again
- Clear Vite cache: `rm -rf node_modules/.vite`

## Enhanced Features

### Name-Based Lookups
The system supports looking up resources by name or email instead of just IDs:

- **Companies**: Use company name instead of ID when creating tickets
- **Contacts**: Use contact email or name
- **Resources**: Use resource email or name for assignments

### Error Handling
- Clear error messages for API failures
- Form validation with user feedback
- Loading states for better UX
- Network timeout handling

## Contributing

When adding new features:
1. Backend: Add endpoints to `backend/api_server.py`
2. Frontend: Add API calls to `frontend/src/services/api.js`
3. Create corresponding page components in `frontend/src/pages/`
4. Update routing in `frontend/src/App.jsx`
5. Update documentation

## Technology Stack

### Frontend
- **React 18**: UI framework
- **Vite**: Build tool and dev server
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library

### Backend
- **Flask**: Python web framework
- **Flask-CORS**: Cross-origin resource sharing
- **httpx**: HTTP client for Autotask API
- **Pydantic**: Data validation (inherited from MCP server)

## License

This project is built on top of the Autotask MCP Server.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the main README.md for Autotask MCP configuration
3. Contact support@sondelaconsulting.com

---

**Made with ❤️ by Sondela Consulting**

*Bringing modern web interfaces to Autotask PSA*
