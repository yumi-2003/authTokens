Authentication System Work Flow
## 🧩 Authentication System Sequence Diagram

```mermaid
---
config:
  theme: default
---
sequenceDiagram
    participant User
    participant Client
    participant Server
    User->>Client: Register (email, password)
    Client->>Server: Send registration data (hashed password)
    Server->>Server: Hash password & store in DB
    Server-->>Client: Registration success
    User->>Client: Login (email, password)
    Client->>Server: Send credentials
    Server->>Server: Validate credentials
    alt Invalid credentials (<3 attempts)
        Server-->>Client: Login failed
    else 3+ failed attempts
        Server-->>Client: Trigger reCAPTCHA verification
        User->>Client: Complete reCAPTCHA
        Client->>Server: Verify reCAPTCHA
        Server-->>Client: reCAPTCHA verified
    end
    alt Valid login
        Server->>Server: Generate OTP (1 min expiry)
        Server->>User: Send OTP via email
        User->>Client: Enter OTP
        Client->>Server: Verify OTP
        Server->>Server: Validate OTP (check expiry in DB)
        alt OTP valid
            Server-->>Client: Issue Access Token (15 mins) & Refresh Token (7 days, HTTP-only cookie)
            Server-->>Client: Generate JWT, store refresh token in DB
            Client-->>User: Login successful, stay logged in
        else OTP expired/invalid
            Server-->>Client: OTP verification failed
        end
    end
    User->>Client: Login with Google
    Client->>Firebase: Authenticate with Google
    Firebase-->>Client: Return verified user token
    Client->>Server: Send Google token for verification
    User->>Client: Access protected resource
    Client->>Server: Send Access Token
    Server->>Server: Verify Access Token (JWT validation)
    alt Token expired
        Client->>Server: Send Refresh Token
        Server->>Server: Validate Refresh Token (from DB)
        Server-->>Client: Issue new Access Token
    end
    User->>Client: Logout
    Client->>Server: Invalidate Refresh Token
    Server-->>Client: Logout success



[![](https://mermaid.ink/img/pako:eNqVVdtu4zYQ_RWCTw7WsuModiwBG8CXdBNg2xhrpwUKvzDSWGYjkSpJJXGDvPYD9hP3SzoUJccXGYv6waTIMzNnZg7JNxrJGGhINfxdgIhgylmiWLYUBH8sMlKRBw3KfedMGR7xnAlDJikHHJiuZ62xki8IPTvGzkE9g7LYata6ec0VaE0-kd8wfucv3WA1HVuLX6VI5HR8vP0LV_DINFjQdj4qzHopHNjy9q6vHb2Q3Ocgyn0c5nJlyB_wSEZ57sAOhXBrFZIp13nKNuRWZjBjCZAXbtbkGyRcG1DdrzLhgjzckToWSzFLw0TMVFzBFDNcVtsNdObFY8bNHpa0IGM8bWOaWr9IFZ99WG_5uQqGZHY_X5Auy3mXYU5dVVH7sHDAHYvHSG1y01kzvW41RDjCfwEBSAzI_WJ2BNtWyvM8CyDaauCZM3Jjc7DLDa6nY0wcNQWkQGPs_p7rgwrdCMxnH_GzKuAaX208afITwX8vAdZpmxR5bLPjulzkEH82qgBnCCLebe1WX1-kTFKoZIRSrPo254nwHnKni7OTGeEYPZElnUi0FUWlKudzSRvSrOOGuxH3zbZGNdbbCfgNTKHEB_0xMIU1XcgnPAStu6mb_Q-ZJS7_kkDlzFgXDeX-4F4VfTf4ifZM1oAF4isnD3hFSWvSJZECm3ahG_S9k-0oTeULXlqRvVlaJS_yXPX27KivzefRnewTB_Fn1UmtsYPuq46lvNQaJhLbLrJUH8Bqj3cCMZk9S6WzkTGQ5VgErMkKKUF8ym5Frj_75Me_34nCqxxrj-NkNFtMbkcnyG_3caZzKTSc8F3178BfEwVduOI7GhoOsmjjYdMo-5FDfUJ9rhC2dprAnt0uFjNPinRDIimfONTPwnGvKwsbAvtVoevWHqWKXZWFOcF7kqIwaxdIiovnul_K8duR7OH15zxvE2_N8d9eCTfCioa2aaJ4TEN7s7RpBgp1hZ_0zXpbUjzTGZ78EKf4cjzZO-AdbfB9-1PKrDZTskjWNFyhavDLXVvVO71dVahsUBNZCEPDnu9flV5o-EZfaTi87Jxf-MNebxgM-wP_KmjTDQ293kW_0w_8y8t-PwjOg_65_96m_5SBe52-3wuCwXngXwwGwWB49f4fEEKpcg?type=png)](https://mermaid.live/edit#pako:eNqVVdtu4zYQ_RWCTw7WsuModiwBG8CXdBNg2xhrpwUKvzDSWGYjkSpJJXGDvPYD9hP3SzoUJccXGYv6waTIMzNnZg7JNxrJGGhINfxdgIhgylmiWLYUBH8sMlKRBw3KfedMGR7xnAlDJikHHJiuZ62xki8IPTvGzkE9g7LYata6ec0VaE0-kd8wfucv3WA1HVuLX6VI5HR8vP0LV_DINFjQdj4qzHopHNjy9q6vHb2Q3Ocgyn0c5nJlyB_wSEZ57sAOhXBrFZIp13nKNuRWZjBjCZAXbtbkGyRcG1DdrzLhgjzckToWSzFLw0TMVFzBFDNcVtsNdObFY8bNHpa0IGM8bWOaWr9IFZ99WG_5uQqGZHY_X5Auy3mXYU5dVVH7sHDAHYvHSG1y01kzvW41RDjCfwEBSAzI_WJ2BNtWyvM8CyDaauCZM3Jjc7DLDa6nY0wcNQWkQGPs_p7rgwrdCMxnH_GzKuAaX208afITwX8vAdZpmxR5bLPjulzkEH82qgBnCCLebe1WX1-kTFKoZIRSrPo254nwHnKni7OTGeEYPZElnUi0FUWlKudzSRvSrOOGuxH3zbZGNdbbCfgNTKHEB_0xMIU1XcgnPAStu6mb_Q-ZJS7_kkDlzFgXDeX-4F4VfTf4ifZM1oAF4isnD3hFSWvSJZECm3ahG_S9k-0oTeULXlqRvVlaJS_yXPX27KivzefRnewTB_Fn1UmtsYPuq46lvNQaJhLbLrJUH8Bqj3cCMZk9S6WzkTGQ5VgErMkKKUF8ym5Frj_75Me_34nCqxxrj-NkNFtMbkcnyG_3caZzKTSc8F3178BfEwVduOI7GhoOsmjjYdMo-5FDfUJ9rhC2dprAnt0uFjNPinRDIimfONTPwnGvKwsbAvtVoevWHqWKXZWFOcF7kqIwaxdIiovnul_K8duR7OH15zxvE2_N8d9eCTfCioa2aaJ4TEN7s7RpBgp1hZ_0zXpbUjzTGZ78EKf4cjzZO-AdbfB9-1PKrDZTskjWNFyhavDLXVvVO71dVahsUBNZCEPDnu9flV5o-EZfaTi87Jxf-MNebxgM-wP_KmjTDQ293kW_0w_8y8t-PwjOg_65_96m_5SBe52-3wuCwXngXwwGwWB49f4fEEKpcg)
