import os
import json
import urllib.request
import urllib.parse
import urllib.error

# Automatically load environment variables from .env if present
def load_env_file():
    env_path = os.path.join(os.path.dirname(__file__), '.env')
    if os.path.exists(env_path):
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, val = line.split('=', 1)
                    key = key.strip()
                    val = val.strip().strip('"\'')
                    if key and key not in os.environ:
                        os.environ[key] = val

load_env_file()

SUPABASE_URL = os.environ.get('SUPABASE_URL', '').rstrip('/')
SUPABASE_KEY = os.environ.get('SUPABASE_KEY', 'sb_publishable_YFq4IQT8l1D2wAUZ7tgBTQ_dilYA7KO')

def is_configured():
    """Returns True if a real Supabase Project URL and Key are provided."""
    if not SUPABASE_URL or not SUPABASE_KEY:
        return False
    if 'your-project-id' in SUPABASE_URL:
        return False
    return True

class SupabaseQueryBuilder:
    def __init__(self, table_name):
        self.table_name = table_name
        self.params = {}
        self.headers = {
            'apikey': SUPABASE_KEY,
            'Authorization': f'Bearer {SUPABASE_KEY}',
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        }

    def _make_url(self):
        url = f"{SUPABASE_URL}/rest/v1/{self.table_name}"
        if self.params:
            url += '?' + urllib.parse.urlencode(self.params)
        return url

    def select(self, columns='*'):
        self.params['select'] = columns
        return self

    def eq(self, column, value):
        self.params[column] = f"eq.{value}"
        return self

    def execute(self):
        if not is_configured():
            return {"data": None, "error": "Supabase URL is not configured. Please add your SUPABASE_URL to .env"}
        
        url = self._make_url()
        req = urllib.request.Request(url, headers=self.headers, method='GET')
        try:
            with urllib.request.urlopen(req, timeout=10) as response:
                data = json.loads(response.read().decode('utf-8'))
                return {"data": data, "error": None}
        except urllib.error.HTTPError as e:
            err_body = e.read().decode('utf-8')
            return {"data": None, "error": f"HTTP {e.code}: {err_body}"}
        except Exception as e:
            return {"data": None, "error": str(e)}

    def insert(self, record_or_records):
        if not is_configured():
            return {"data": None, "error": "Supabase URL is not configured."}
        
        url = f"{SUPABASE_URL}/rest/v1/{self.table_name}"
        body = json.dumps(record_or_records).encode('utf-8')
        req = urllib.request.Request(url, data=body, headers=self.headers, method='POST')
        try:
            with urllib.request.urlopen(req, timeout=10) as response:
                data = json.loads(response.read().decode('utf-8'))
                return {"data": data, "error": None}
        except urllib.error.HTTPError as e:
            err_body = e.read().decode('utf-8')
            return {"data": None, "error": f"HTTP {e.code}: {err_body}"}
        except Exception as e:
            return {"data": None, "error": str(e)}

def table(name):
    return SupabaseQueryBuilder(name)

def test_connection():
    """Tests connectivity to the Supabase endpoint."""
    if not is_configured():
        return {
            "connected": False,
            "message": "SUPABASE_URL is missing or set to placeholder. Please specify your Supabase Project URL in .env."
        }
    try:
        health_url = f"{SUPABASE_URL}/auth/v1/health"
        headers = {'apikey': SUPABASE_KEY}
        req = urllib.request.Request(health_url, headers=headers, method='GET')
        with urllib.request.urlopen(req, timeout=5) as resp:
            # Now check if tables are created
            table_check = table('branches').select('code').execute()
            tables_exist = table_check.get('error') is None
            
            return {
                "connected": True,
                "status_code": resp.status,
                "tables_initialized": tables_exist,
                "message": "Successfully connected to Supabase!" if tables_exist else "Connected to Supabase! (Tables pending setup: run supabase_schema.sql in Supabase SQL Editor)"
            }
    except Exception as e:
        return {"connected": False, "message": str(e)}
