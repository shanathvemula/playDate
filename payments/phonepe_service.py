import requests
import uuid
from django.conf import settings
from tenacity import retry, stop_after_attempt, wait_exponential


@retry(stop=stop_after_attempt(3), wait=wait_exponential(min=1, max=5))
def create_phonepe_order(access_token, order_payload):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"O-Bearer {access_token}",
        "X-Idempotency-Key": str(uuid.uuid4())
    }

    res = requests.post(
        settings.PHONEPE["PAY_URL"],
        json=order_payload,
        headers=headers,
        timeout=settings.PHONEPE["TIMEOUT"]
    )

    return res
