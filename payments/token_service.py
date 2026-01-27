import requests
from django.conf import settings
from django.core.cache import cache
from tenacity import retry, stop_after_attempt, wait_exponential

TOKEN_CACHE_KEY = "PHONEPE_ACCESS_TOKEN"
TOKEN_TTL = 55 * 60  # 55 minutes


@retry(stop=stop_after_attempt(3), wait=wait_exponential(min=1, max=5))
def fetch_phonepe_token():
    # ✅ Redis cache lookup
    token = cache.get(TOKEN_CACHE_KEY)
    if token:
        return token

    payload = {
        "client_id": settings.PHONEPE["CLIENT_ID"],
        "client_secret": settings.PHONEPE["CLIENT_SECRET"],
        "client_version": settings.PHONEPE["CLIENT_VERSION"],
        "grant_type": "client_credentials",
    }

    headers = {"Content-Type": "application/x-www-form-urlencoded"}

    res = requests.post(
        settings.PHONEPE["TOKEN_URL"],
        data=payload,
        headers=headers,
        timeout=settings.PHONEPE["TIMEOUT"],
    )

    data = res.json()

    if res.status_code != 200 or "access_token" not in data:
        raise Exception(f"PhonePe token error: {data}")

    access_token = data["access_token"]

    # ✅ Store in Redis
    cache.set(TOKEN_CACHE_KEY, access_token, TOKEN_TTL)

    return access_token
