import qrcode
import base64
from io import BytesIO

# # UPI link with amount
# upi_link = "upi://pay?pa=9989696475-4@axl&pn=Playdate%20Sport&mc=0000&mode=02&purpose=00&am=5&tn=O2X5V3A1R_py&url=https%3A%2F%2Fplaydatesport.com%2F"
# print(upi_link)
# # Generate QR code
# qr = qrcode.make(upi_link)
#
# # Save QR code to in-memory buffer
# buffer = BytesIO()
# qr.save(buffer, format="PNG")
# buffer.seek(0)
#
# # Convert to base64
# img_base64 = base64.b64encode(buffer.read()).decode("utf-8")
#
# # Print or use the base64 string
# print(f"data:image/png;base64,{img_base64}")

