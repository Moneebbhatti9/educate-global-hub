import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Scale, Users, AlertTriangle } from "lucide-react";

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-white sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Scale className="w-6 h-6 text-brand-primary" />
              <span className="font-heading font-bold text-xl">
                Educate Link
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="space-y-8">
          {/* Title Section */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 bg-brand-secondary/10 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-brand-secondary" />
              </div>
              <h1 className="font-heading font-bold text-4xl text-foreground">
                Terms & Conditions
              </h1>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Please read these terms and conditions carefully before using our
              platform.
            </p>
            <p className="text-sm text-muted-foreground">
              Last updated: March 15, 2024
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-6">
            {/* General Terms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-brand-primary/10 rounded-lg flex items-center justify-center">
                    <Scale className="w-4 h-4 text-brand-primary" />
                  </div>
                  <span>General Terms</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p className="text-muted-foreground mb-4">
                  Please read these conditions carefully before using the
                  Educate Link website. By using the Educate Link website, you
                  signify your agreement to be bound by these conditions.
                </p>

                <h4 className="font-semibold text-foreground mb-3">
                  Definitions
                </h4>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    <strong>"Client"</strong> means the representative of the
                    company, the company, firm or organisation which has set up
                    an account with Educate Link in order to use the Services.
                  </p>
                  <p>
                    <strong>"Commencement Date"</strong> means the date for the
                    commencement of the Services as set out in the Order
                    Confirmation.
                  </p>
                  <p>
                    <strong>"Order Confirmation"</strong> means, in the case of
                    online orders, the confirmation of purchase on the Website
                    of one or more of the Services; and in the case of orders
                    via the Educate Link sales team, the form signed by the
                    Client confirming details and Pricing Model(s) of the
                    Services ordered by the Client.
                  </p>
                  <p>
                    <strong>"Pricing Model(s)"</strong> means the pricing models
                    offered by Educate Link as set out in clause 3.
                  </p>
                  <p>
                    <strong>"Educate Link"</strong> means HUSNAZ Ltd, acting
                    through its division Educate Link.
                  </p>
                  <p>
                    <strong>"Educate Link Group"</strong> means all companies in
                    the same group as Educate Link. Two companies are in the
                    same group if they share the same ultimate holding company.
                  </p>
                  <p>
                    <strong>"Services"</strong> means the online recruitment
                    services as set out in clause 2.
                  </p>
                  <p>
                    <strong>"Terms"</strong> means these terms and conditions.
                  </p>
                  <p>
                    <strong>"Website"</strong> means www.Educatelink.org and
                    includes without limitation its content, databases,
                    software, code and graphics.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-brand-accent-green/10 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-brand-accent-green" />
                  </div>
                  <span>Services</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p className="text-muted-foreground mb-4">
                  The following Services are available from Educate Link via the
                  Website:
                </p>
                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <h5 className="font-semibold text-foreground mb-2">
                      Recruitment
                    </h5>
                    <p>
                      A service whereby new Clients can download a number of CVs
                      and existing Clients can post a number of jobs.
                      Recruitment allowance available once within a 12 month
                      period. Vacancies, applicants and responses can be managed
                      via the Client's Recruitment account.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-foreground mb-2">
                      Premium Job Postings
                    </h5>
                    <p>
                      A service whereby the Client's job postings will be given
                      greater prominence in job listings.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-foreground mb-2">
                      Featured or Premium+ Job Postings
                    </h5>
                    <p>
                      A service whereby Clients may specify that one or more job
                      postings appear in "Featured Jobs" pages/spaces on the
                      Website, with candidates who best match the criteria set
                      by the Client in the job posting emailed with details of
                      the vacancy.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-foreground mb-2">
                      CV Search
                    </h5>
                    <p>
                      The Client will be given access to a search engine to
                      search for candidate CVs which match the criteria and
                      filtering set by the Client. Various bundles of CV
                      downloads may be purchased, subject to a fair usage cap.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-foreground mb-2">
                      Branding Opportunities
                    </h5>
                    <p>
                      Various opportunities to promote Client brands are
                      available, including Recruiter Profile, where Clients can
                      themselves create a profile of their company or
                      organisation on the Website or request for doing the same
                      via Educate Link admin.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-foreground mb-2">
                      Email & SMS Services
                    </h5>
                    <p>
                      Various email & SMS services are available, including
                      targeted emails or text messages, where Educate Link will
                      send a one off email or text with details of the Client's
                      job(s) to a number of the most recently registered
                      candidates who match the criteria set by the Client.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-foreground mb-2">
                      Pay for Performance
                    </h5>
                    <p>
                      A service when made available whereby the Client only pays
                      the amount set out in the Order Confirmation for every
                      candidate who applies to its job listings. Pay for
                      Performance can be used in conjunction with other Educate
                      Link products and services.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing Models */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-brand-secondary/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-brand-secondary" />
                  </div>
                  <span>Pricing Models</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p className="text-muted-foreground mb-4">
                  The following Pricing Models are available in relation to the
                  Services offered:
                </p>
                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <h5 className="font-semibold text-foreground mb-2">
                      Ads by Volume
                    </h5>
                    <ul className="list-disc list-inside space-y-1">
                      <li>
                        The Client will buy from Educate Link number of job
                        postings as set out in the Order Confirmation
                      </li>
                      <li>
                        Pricing and payment method will be set out in the Order
                        Confirmation
                      </li>
                      <li>
                        All job postings must be posted within 12 months of date
                        of purchase (unless otherwise set out in the Order
                        Confirmation)
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-foreground mb-2">
                      CVs by Volume
                    </h5>
                    <ul className="list-disc list-inside space-y-1">
                      <li>
                        The Client will buy CV downloads as set out in the Order
                        Confirmation
                      </li>
                      <li>The Client will pay upfront for the CV downloads</li>
                      <li>
                        The Client is entitled to download CVs at any time
                        within the contract period set out in the Order
                        Confirmation subject to Educate Link's fair usage policy
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-foreground mb-2">
                      Subscription Services - Job Postings
                    </h5>
                    <p>The Client may post an unlimited number of jobs.</p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-foreground mb-2">
                      Subscription Services - CV Search
                    </h5>
                    <p>
                      The Client is entitled to download an unlimited number of
                      CVs subject to Educate Link's fair usage.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contract Formation & Payment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-brand-accent-orange/10 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-brand-accent-orange" />
                  </div>
                  <span>Contract Formation & Payment</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Educate Link shall provide the Services in accordance with
                    these Terms. Clients must set up an account with Educate
                    Link in order to gain access to the Services. The Services
                    do not constitute an offer by Educate Link, and Educate Link
                    reserves the right in its sole and absolute discretion to
                    refuse to offer the Services to any person or organisation.
                  </p>

                  <p>
                    A legally binding contract between Educate Link and the
                    Client comprising these Terms and the Order Confirmation
                    will come into effect when (i) in the case of online orders,
                    the screen confirming the successful purchase of Services
                    appears on the Website or (ii) in the case of orders via the
                    Educate Link sales team, Educate Link has received the
                    Client's completed Order Confirmation. The Client
                    acknowledges that such contract is conditional upon the
                    Client passing Educate Link's credit checking process.
                  </p>

                  <p>
                    Other than for Services paid for online or by phone using
                    debit or credit cards (where Educate Link will provide
                    payment confirmation after payment has been taken), Educate
                    Link shall issue an invoice to the Client on formation of
                    contract, and in the case of Subscription Services, at set
                    intervals in advance thereafter. The Client shall pay
                    Educate Link's invoices in full within 14 days from the date
                    of invoice.
                  </p>

                  <p>
                    In the event of late payment, Educate Link may suspend any
                    or all of the Services until payment is received. In the
                    event that the Client fails to pay any invoice within 7 days
                    of receipt of a Notice to Pay (receipt shall be deemed to be
                    2 working days after the date of such notice), Educate Link
                    may terminate the Services and all outstanding invoices
                    shall become payable immediately.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Processing */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Processing</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Online payment services will be carried out by Opayo
                    (Sagepay) or Stripe. Online card payments shall be subject
                    to Opayo's (Sagepay's) or Stripe's terms and conditions. The
                    relevant provider will be identified when payment is made.
                  </p>

                  <p>
                    Educate Link does not save payment card details and the card
                    details are removed from the site after use but not from the
                    third party payment gateway supplier (Stripe). Educate Link
                    still holds the ability to charge the card manually in the
                    event there is an outstanding balance.
                  </p>

                  <p>
                    New Client offer: The reduced offer is only applicable for
                    the products or services stated on the offer and cannot be
                    used for any other products or services. The reduced offer
                    can only be used once per Client whilst the price is
                    advertised on the website.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Cancellation & Refunds */}
            <Card>
              <CardHeader>
                <CardTitle>Cancellation & Refunds</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Once a contract has been formed, Educate Link can accept any
                    cancellation of the Educate Link Services: Refunds will be
                    given however deduction of administration and 3rd Party
                    charges may apply. Any outstanding invoices shall remain
                    payable.
                  </p>

                  <p>
                    Subscription Services (Job Search and CV Search) are for a
                    minimum term of 3, 6, 9 or 12 months. In the event of early
                    termination, no refunds will be given due to the nature of
                    the product and services, outstanding invoices shall remain
                    payable, and the fees in respect of any outstanding minimum
                    term shall become payable.
                  </p>

                  <p>
                    For the avoidance of doubt, Recruitment, Premium, Featured
                    and Premium+ Job Posting credits and CV Search credits do
                    not roll over beyond the contract end date. Any Job Postings
                    that are live on the Website will remain live until their
                    expiry date, but no new Job Postings can be made using the
                    credits from the relevant contract.
                  </p>

                  <p>
                    For Services purchased online, refunds may occasionally be
                    given at Educate Link's sole and absolute discretion.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Termination & Account Closure */}
            <Card>
              <CardHeader>
                <CardTitle>Termination & Account Closure</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Without prejudice to any other remedy, Educate Link may
                    terminate the Client's account and any or all contracts and
                    Services with immediate effect in the event of material or
                    persistent breach of these Terms by the Client or if Educate
                    Link has reasonable grounds to believe that the Client
                    cannot or will not pay its debts.
                  </p>

                  <p>
                    Educate Link reserves the right to close any account
                    immediately without liability if, in its opinion, any of the
                    following has occurred:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      The Client has not provided full or accurate contact or
                      company information
                    </li>
                    <li>
                      Educate Link considers the Client is acting
                      inappropriately or illegally
                    </li>
                    <li>
                      The Client is using the Website to advertise websites,
                      services, interest based financial packages, businesses
                      and/or business opportunities (unless the business is a
                      Educate Link franchise system) in any part of the job
                      vacancy or on any part of the site not authorised to do
                      so. Any goods or services that defame any religion or
                      culture or are against islamic sharia principles are
                      strictly prohibited
                    </li>
                    <li>
                      The Client fails Educate Link's credit checking process,
                      or defaults on payment
                    </li>
                    <li>
                      The Client resells job postings without the express
                      permission of Educate Link
                    </li>
                    <li>
                      The Client has been given permission to resell job
                      postings but does not accurately represent the products
                      and services that are offered by Educate Link
                    </li>
                    <li>
                      The Client has shared its CV Search access with a third
                      party
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Job Postings */}
            <Card>
              <CardHeader>
                <CardTitle>Job Postings</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    By submitting a vacancy to the Website, the Client is
                    authorising Educate Link to post such vacancy and submit
                    candidates ranked by Educate Link in accordance with the
                    Client's criteria (if any).
                  </p>

                  <p>
                    The Client is responsible for the content of the vacancy and
                    will indemnify Educate Link against any claim, loss,
                    liability, expense and/or damage ("Losses") in connection
                    therewith.
                  </p>

                  <p>
                    The Client shall include in the job description the
                    following information:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      Any qualifications and/or authorisations required by law
                      or any or by any relevant professional body
                    </li>
                    <li>
                      If the rate of pay is included, the job description must
                      also include the nature of the work, the location, minimum
                      experience, training and/or qualifications required in
                      order for an applicant to receive such rate of pay
                    </li>
                    <li>
                      Where the Client is an employment agency or employment
                      business (as defined in the Employment Agencies Act 1973),
                      it must state in which capacity it is acting in relation
                      to the vacancy
                    </li>
                  </ul>

                  <p>
                    The Client shall provide sufficient details about itself and
                    the vacancy to applicants including without limitation the
                    Client's identity, the nature of its business, the nature of
                    the role, the type of work to be performed, the commencement
                    date, the likely duration, the hours of work, the location,
                    the remuneration, the intervals of payment and benefits, and
                    the notice periods required to be given and received.
                  </p>

                  <p>
                    The Client will comply with all applicable laws, including
                    without limitation: current data protection legislation and
                    the Equality Act 2010. By submitting a vacancy to the
                    Website, the Client thereby confirms that the content of the
                    vacancy complies with the Code of Practice on Employment
                    provided by the Equality and Human Rights Commission.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* CV Searching */}
            <Card>
              <CardHeader>
                <CardTitle>CV Searching</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    The number of CV downloads is subject to a fair usage cap:
                    there are limits to CV downloads per user per day (unless
                    otherwise set out in the Order Confirmation). A user is a
                    person or organisation with a unique login. A Client may
                    have more than one user with Educate Link.
                  </p>

                  <p>
                    For the purpose of the fair usage cap, each of the following
                    will count as one download:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      Downloading a candidate's CV from the Website onto any
                      computer device such as a PC, phone or tablet computer
                    </li>
                    <li>Viewing a candidate's full profile on the Website</li>
                    <li>
                      Adding a candidate to a shortlist created on the Website
                    </li>
                    <li>Sending a message to a candidate via the Website</li>
                  </ul>

                  <p>
                    Previewing a candidate's profile will not be considered as a
                    download.
                  </p>

                  <p>
                    CV search access can only be used for recruitment purposes.
                    Using CV Search for the purposes of marketing or direct
                    selling to candidates is prohibited, and will result in the
                    suspension of the account. The Client shall not use any
                    automated computer program to search for and/or download
                    information on candidates.
                  </p>

                  <p>
                    The Client must not share its access details for CV Search
                    or any other services offered by Educate Link from time to
                    time with any other party. This is classed as material
                    breach of the contract and therefore such material breach
                    will be dealt with seriously.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Limitation of Liability */}
            <Card>
              <CardHeader>
                <CardTitle>Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Educate Link cannot guarantee that (i) the Website and/or
                    the Services will be available at all times; (ii) the
                    Website will be free from errors, viruses and/or other
                    harmful applications; and (iii) the Services will generate
                    any applications, responses or results (Premium+ Job
                    Postings excepted, by which the Client will receive the
                    number of applications as set out in the description of the
                    relevant Service). For the avoidance of doubt, no Service is
                    guaranteed to result in a placement.
                  </p>

                  <p>
                    In the event that the Client makes a claim against Educate
                    Link for whatever reason, Educate Link's liability (if any)
                    shall not exceed the price paid or to be paid by the Client
                    for the Services. Under no circumstances shall Educate Link
                    be liable for any consequential, indirect or special losses
                    howsoever arising or for any loss of profits, revenue,
                    interest, goodwill, business and/or savings (whether direct
                    or indirect).
                  </p>

                  <p>
                    Nothing in these Terms shall be construed to exclude Educate
                    Link's liability for death or personal injury by negligence
                    or any other liability which cannot by law be excluded.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Data Protection */}
            <Card>
              <CardHeader>
                <CardTitle>Data Protection</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    For the sake of clarity and the avoidance of doubt, the
                    Client acknowledges that it is acting as a data controller
                    for the purpose of current data protection legislation in
                    connection with any personal data it obtains in the
                    provision of the Services by Educate Link. It is the
                    Client's responsibility to comply with its obligations as a
                    data controller and to satisfy themselves of the legal
                    grounds for processing any personal data.
                  </p>

                  <p>
                    Educate Link acknowledges that it will act as a data
                    controller for the purposes of current data protection
                    legislation and that it will comply with its legal
                    obligations in the provision of the Services.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Governing Law */}
            <Card>
              <CardHeader>
                <CardTitle>Governing Law</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    The Terms shall be governed by English law and the parties
                    submit to the exclusive jurisdiction of the courts of
                    England and Wales.
                  </p>

                  <p>
                    If any clause or part of a clause is held to be invalid or
                    unenforceable, this will not affect the validity or
                    enforceability of the remaining clauses or parts.
                  </p>

                  <p>
                    These Terms and, where appropriate, the Order Confirmation
                    contain the entire agreement and understanding between
                    Educate Link and the Client. The Client acknowledges that it
                    has not relied on any representation made by Educate Link in
                    entering this contract, however, nothing in this clause
                    shall exclude any liability for fraudulent
                    misrepresentation.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  For questions about these terms and conditions, please contact
                  us:
                </p>
                <div className="space-y-2 text-muted-foreground">
                  <p>
                    <strong>Email:</strong> Educate Link@gmail.com
                  </p>
                  <p>
                    <strong>Notices:</strong> Notices to Educate Link shall be
                    sent by email to Educate Link@gmail.com clearly stating in
                    the subject line the correct subject matter after the word
                    NOTICE in capital letters
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer Links */}
          <div className="border-t border-border pt-8">
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link
                to="/privacy"
                className="text-brand-primary hover:underline"
              >
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-brand-primary hover:underline">
                Terms & Conditions
              </Link>
              <Link to="/gdpr" className="text-brand-primary hover:underline">
                GDPR Compliance
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsConditions;
