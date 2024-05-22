# import frappe
# from frappe.utils import flt
# from frappe.core import get_doc

# @frappe.whitelist()
# def get_recent_sales_invoices_with_item(item_code):
#   # Replace with your actual filtering logic for "recent" invoices
#   # (e.g., created date within the last week, month)
#   from_date = frappe.utils.add_days(frappe.datetime.get_date(), -7)  # Example: filter for last 7 days

#   invoices = frappe.get_list("Sales Invoice", filters={
#     "docstatus": "Submitted",  # Example filter for submitted invoices
#     "creation_date": [">=", from_date],
#     "items": [("item_code", "=", item_code)]  # Filter for invoices with the item
#   })

#   if not invoices:
#     return {"message": "No recent sales invoices found for this item."}

#   # Extract relevant invoice data (modify as needed)
#   invoice_data = []
#   for invoice in invoices[:5]:  # Limit to top 5 invoices
#     invoice_doc = get_doc("Sales Invoice", invoice.name)  # Fetch full invoice doc
#     item_row = invoice_doc.get("items")[0]  # Assuming only 1 item with this code
#     invoice_data.append({
#       "name": invoice.name,
#       "customer": invoice_doc.customer,
#       "item_code": item_row.item_code,
#       "item_name": item_row.item_name,
#       "qty": flt(item_row.qty),
#       "rate": flt(item_row.rate),
      
#     })

#   return {"invoices": invoice_data}


import frappe

@frappe.whitelist()
def send_email_with_invoices(item_code):
    # Fetch the latest 5 sales invoices for the item
    invoices = frappe.get_all('Sales Invoice Item',
        filters={'item_code': item_code},
        fields=['parent', 'creation'],
        order_by='creation desc',
        limit=5
    )

    if not invoices:
        frappe.msgprint('No sales invoices found for this item')
        return

    # Prepare the attachment
    attachments = []
    for invoice in invoices:
        doc = frappe.get_doc('Sales Invoice', invoice['parent'])
        attachments.append(frappe.attach_print('Sales Invoice', doc.name, print_format='Standard'))

    # Prepare the email content
    email_content = f"""
    <h3>Latest 5 Sales Invoices for Item {item_code}</h3>
    <ul>
    {''.join([f"<li>{inv['parent']} - {inv['creation']}</li>" for inv in invoices])}
    </ul>
    """

    # Send the email
    frappe.sendmail(
        recipients=['anasm8481@gmail.com'],
        subject=f'Latest 5 Sales Invoices for Item {item_code}',
        message=email_content,
        attachments=attachments
    )

    frappe.msgprint('Email sent successfully')
