# 🚀 Autotask MCP Server + Web Frontend

> **Two ways to use Autotask**: MCP Server for Claude Desktop or Web Interface for browser-based access




---

## 🌐 NEW: Web Frontend

We now offer a modern web-based interface for managing Autotask! Choose between:

1. **MCP Server** - Use with Claude Desktop for AI-powered ticket management
2. **Web Interface** - Browser-based UI for direct access to Autotask

### Quick Start - Web Interface

```bash
# 1. Clone or download this repository
# 2. Configure your Autotask credentials
cp backend/.env.example backend/.env
# Edit backend/.env with your credentials

# 3. Start the web application (starts both backend and frontend)
./start_web.sh
```

Then open your browser to **http://localhost:3000**

**Full Documentation**: See [WEB_FRONTEND_README.md](./WEB_FRONTEND_README.md) for complete setup, features, and usage.

---

## 🎯 MCP Server Setup (5 Minutes)

### Step 1: Install Dependencies
```bash
pip install mcp httpx pydantic
```

### Step 2: Test Your Connection
```bash
python test_autotask_connection.py
```

**Enter your credentials:**  (You need to enter your own credentials )
- Username: `username@domain.com`
- Secret: `1234567890`
- Integration Code: `12345678`
- API URL: `https://webservices[x].autotask.net/ATServicesRest/v1.0,
  (If you are on ww16.autotask.net then the webservices[x] would be webservices16.autotask.net)

**Expected result:**
```
✅ Authentication successful!
✅ Retrieved sample company: [Name]
✅ Ticket access successful!
```

### Step 3: Configure Claude Desktop

**macOS:**
```bash
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```

**Add this:**
```json
{
  "mcpServers": {
    "autotask": {
      "command": "python",
      "args": ["/FULL/PATH/TO/autotask_mcp.py"],
      "env": {
     "AUTOTASK_USERNAME": "your-username@company.com",
        "AUTOTASK_SECRET": "your-api-secret-here",
        "AUTOTASK_INTEGRATION_CODE": "your-integration-code-here",
        "AUTOTASK_API_URL": "https://webservices5.autotask.net/ATServicesRest/v1.0"
      }
    }
  }
}
```

### Step 4: Restart Claude Desktop
Completely quit and restart Claude Desktop.

### Step 5: Start Using!
Try these in Claude:
- *"Show me all open tickets"*
- *"Create a ticket for company 12345 about email issues"*
- *"Find companies with 'Tech' in the name"*



## 🎪 What You Can Do

### Ticket Management
- Search tickets with filters
- Get specific ticket details
- Create new tickets
- Update ticket status/priority/assignment
- Add notes to tickets

### Company Management
- Search companies by name
- Get company details

### Contact Management
- Search contacts by company/email/name
- Get contact information

### Response Formats
- **Markdown** - Human-readable (default)
- **JSON** - Machine-readable for automation

---

## 🆘 Troubleshooting

### "Authentication failed"
- Verify credentials are correct
- Check for extra spaces
- Ensure API user has proper security level

### "Resource not found"
- Verify the ID exists
- Check user has permission to access it

### "MCP server not appearing"
- Check JSON syntax in config
- Verify absolute path to .py file
- Restart Claude Desktop completely
- Check logs in `~/Library/Logs/Claude/`

### "405 Method Not Allowed"
- You have an old version - re-download the files

---

## 📚 Documentation

- **QUICKSTART.md** - Fast setup guide
- **README.md** - Comprehensive documentation  

---

## ✨ Features

✅ **8 Tools** - Complete ticket, company, and contact management  
✅ **Header Auth** - Simple username/secret/integration code  
✅ **Error Handling** - Clear, actionable error messages  
✅ **Best Practices** - Follows MCP Python SDK standards  
✅ **Production Ready** - Async, validated, type-hinted  
✅ **Well Documented** - Comprehensive guides and examples  

---

## 🎉 You're Ready!

1. ✅ Download the files
2. ✅ Test the connection  
3. ✅ Configure Claude Desktop
4. ✅ Start managing Autotask with Claude!

**Questions?** Check the README.md for detailed help or contact us at support@sondelaconsulting.com

**Issues?** The test script will tell you exactly what's wrong.

---


**Made with ❤️ by Sondela Consulting**

*Getting your PSA workflows connected to Claude's intelligence*
