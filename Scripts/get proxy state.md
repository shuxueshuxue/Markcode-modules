#proxy 

```yaml title:"config file in clash folder"
mixed-port: 7890
allow-lan: true
external-controller: 127.0.0.1:4181
secret: d848909b-7e52-4dc9-8a16-47f822a4d2a2
```

```python
import sys
import subprocess

def get_windows_proxy_state():
    try:
        import winreg
        key = winreg.OpenKey(winreg.HKEY_CURRENT_USER, r"Software\Microsoft\Windows\CurrentVersion\Internet Settings")
        proxy_enable, _ = winreg.QueryValueEx(key, "ProxyEnable")
        return bool(proxy_enable)
    except ImportError:
        return "Unable to check on non-Windows system"
    except WindowsError:
        return "Unable to read Windows registry"

def get_macos_proxy_state():
    try:
        output = subprocess.check_output(["networksetup", "-getwebproxy", "Wi-Fi"]).decode()
        return "Enabled: Yes" in output
    except subprocess.CalledProcessError:
        return "Unable to check proxy settings on macOS"

def get_linux_proxy_state():
    try:
        env_vars = ['http_proxy', 'https_proxy', 'ftp_proxy']
        for var in env_vars:
            if var in os.environ:
                return True
        return False
    except Exception as e:
        return f"Error checking Linux proxy settings: {str(e)}"

def get_system_proxy_state():
    if sys.platform.startswith('win'):
        return get_windows_proxy_state()
    elif sys.platform.startswith('darwin'):
        return get_macos_proxy_state()
    elif sys.platform.startswith('linux'):
        return get_linux_proxy_state()
    else:
        return "Unsupported operating system"

if __name__ == "__main__":
    proxy_enabled = get_system_proxy_state()
    print(f"System Proxy Enabled: {proxy_enabled}")
```