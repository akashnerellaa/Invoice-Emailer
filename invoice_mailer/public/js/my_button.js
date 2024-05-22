// frappe.ui.form.on('Item', {
//     refresh: function(frm) {
  
//       // Create custom button and add it to Actions section
//       frm.add_custom_button(__('Email Recent Sales Invoices'), function() {
//         const itemCode = frm.doc.name; // Get the current item code
  
//         // Fetch recent sales invoices associated with the current item
//         frappe.call({
//           method: "invoice_emailer/public/python/email_invocing.get_recent_sales_invoices_with_item",
//           args: {
//             "item_code": itemCode
//           },
//           callback: function(data) {
//             if (data.message) {
//               frappe.msgprint(data.message); // Inform user if no invoices found
//               return;
//             }
  
//             // Extract recent invoices (up to 5)
//             const recentInvoices = data.invoices.slice(0, 5);
  
//             if (!recentInvoices.length) {
//               frappe.msgprint(__("No recent sales invoices found for this item."));
//               return;
//             }
  
//             // Prepare email content with invoice details (assuming fields like item_name, qty, rate, etc. exist)
//             let emailContent = <h2>Recent Sales Invoices for Item: ${itemCode} (${frm.doc.item_name})</h2>;
//             recentInvoices.forEach(invoice => {
//               emailContent += `
//                   <ul>
//                     <li>Invoice Number: ${invoice.name}</li>
//                     <li>Customer Name: ${invoice.customer}</li>
//                     <li>Item Name: ${invoice.item_code} (${invoice.item_name})</li>
//                     <li>Quantity: ${invoice.qty}</li>
//                     <li>Rate: ${invoice.rate}</li>
//                   </ul>`;
//             });
  
//             // Send email to admin using frappe.call
//             frappe.call({
//               method: "frappe.core.send_mail",
//               args: {
//                 "sender": frappe.session.user,
//                 "recipients": ["anasm8481@gmail.com"], // Replace with your admin email
//                 "subject": `Recent Sales Invoices for Item: ${itemCode}`,
//                 "message": emailContent,
//                 "cc": [], // Add CC recipients if needed
//                 "bcc": [] // Add BCC recipients if needed
//               },
//               callback: function(data) {
//                 if (data.exc) {
//                   frappe.msgprint(data.exc, __("Error"));
//                 } else {
//                   frappe.msgprint(__("Email sent successfully!"));
//                 }
//               }
//             });
//           }
//         });
//       }, __('Actions'));
//     }
//   });


// frappe.ui.form.on('Item', {
//       refresh: function(frm) {
      
//         frm.add_custom_button(__('Email'), function(){
//           // frappe.msgprint(frm.doc.email);
//           console.log("Clicked")
//       }, __('Actions'));
      
//     }
//   });

// /invoice_mailer/public/python/email_invoicing.send_email_with_invoices
frappe.ui.form.on('Item', {
  refresh: function(frm) {
      if (!frm.doc.__islocal) {
          frm.add_custom_button(__('Send Email'), function() {
              frappe.call({
                  method: 'invoice_mailer.public.python.email_invoicing.send_email_with_invoices',
                  args: {
                      item_code: frm.doc.item_code
                  },
                  callback: function(r) {
                      if (!r.exc) {
                          frappe.msgprint(__('Email sent successfully'));
                      }
                  }
              });
          }, __('Actions'));
      }
  }
}); 
