# RAD Field Scout Network 🦅

The **RAD Field Scout Network** is a custom-built Progressive Web App (PWA) designed to crowdsource B2B sales leads for AITX by turning their engaged retail shareholder base into a decentralized prospecting team.

When an advocate (a "Scout") spots a commercial vulnerability—such as an empty guard shack, a sleeping security guard, or an unmonitored logistics gate—they use this mobile app to snap a photo, capture the GPS coordinates, and instantly route that lead to the AITX Enterprise Sales team.

---

## 📱 How to Use It: The Scout Experience (Mobile)

We designed the front-end to be completely frictionless. A user sitting in their car can submit a high-quality, data-rich lead in under 30 seconds.

1. **Passwordless Login:** Scouts go to the platform URL on their phone, enter their email, and receive a secure "Magic Link" to log in instantly. 
2. **The Gamified Dashboard:** Upon logging in, they see their current Rank, total points, and a live feed of their past submissions showing real-time pipeline statuses (e.g., *Pending, Verified, Demo Booked, Deployed*).
3. **Submitting a Lead:**
   - **Snap & Upload:** Tapping the evidence box opens their phone's native camera to photograph the security gap.
   - **One-Click GPS:** Tapping "Use My Current Location" pings the browser's HTML5 Geolocation API, instantly locking in the exact Latitude/Longitude of the property.
   - **Categorization:** They select the property type (e.g., *Auto Dealership*) and the specific gap observed (e.g., *Passive Cameras Only*).
   - **Submit:** The lead is securely fired to the AITX database.

---

## 💻 How to Use It: The AITX Team Experience (Desktop)

The platform includes a secure, role-protected back-office control panel for the AITX sales team to triage incoming data.

1. **Accessing the Triage Panel:** AITX staff navigate to the `/admin` route of the website. Because the database uses strict Row-Level Security (RLS), only authorized staff accounts can view this page. Retail scouts attempting to access this URL are automatically redirected.
2. **Reviewing Leads:** The dashboard features a master data grid of all incoming leads. Staff can view the uploaded evidence photos, assess the security gap notes, and see exactly where the property is located.
3. **Updating the Pipeline:** On the right side of the grid, staff can update the status of any lead using a dropdown menu. 
4. **Closing the Loop:** When an admin changes a lead's status to *Demo Booked* or *Deployed*, the Scout who submitted the lead will see their personal dashboard update, validating their effort and unlocking corporate perks.

---

## 🛠 Technology Stack & Security

* **Frontend:** Next.js 14 (App Router), React, and Tailwind CSS.
* **Backend & Auth:** Supabase (PostgreSQL, Storage, Auth).
* **Security:** Strict Database-level Row-Level Security (RLS) policies ensure that users can mathematically only access their own data, preventing any public leakage of the sales pipeline. 

## 🚀 Deployment & Handoff

For detailed instructions on how to deploy this application to Vercel and set up the Supabase database infrastructure, please read the [HANDOFF.md](./HANDOFF.md) file included in this repository.
