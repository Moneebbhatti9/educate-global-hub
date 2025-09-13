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
                    event there is an outstanding balance. For any further
                    questions, please contact Educate Link Client support. If
                    you wish to erase your card details from the payment gateway
                    supplier, please contact Stripe directly.
                  </p>

                  <p>
                    New Client offer: The reduced offer is only applicable for
                    the products or services stated on the offer and cannot be
                    used for any other products or services. The reduced offer
                    can only be used once per Client whilst the price is
                    advertised on the website. This offer cannot be combined
                    with any other ongoing promotions, discounts, or offers
                    unless clearly stated on the website or in the terms and
                    conditions. The offer is only available to Clients who have
                    received the offer. We reserve the right to change pricing,
                    the broader offer, or these Terms and Conditions at any
                    time.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Credential-on-File */}
            <Card>
              <CardHeader>
                <CardTitle>Credential-on-File</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    The Client may provide Educate Link with a recurring payment
                    authority to enable Educate Link to take regular payments
                    from the Client's nominated card for payment of the
                    Services. Such authority must be provided to Educate Link's
                    sales team by phone or online through the Client's Recruiter
                    account. When a recurring payment authority has been
                    provided, Educate Link will store the Client's payment
                    credentials (primary account number and expiration date),
                    and will be entitled to take regular payments for the
                    Services from the nominated card without the need to obtain
                    individual authorisation for every payment.
                  </p>
                  <p>
                    The Client may cancel or update a recurring payment
                    authority at any time by calling Educate Link's sales team
                    or online in the Client's Recruiter account, and Educate
                    Link will delete the Client's payment credentials. The
                    Client will remain liable for any outstanding fees (if any)
                    in the event that a recurring payment authority is cancelled
                    prior to paying for all Services provided.
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
                    payable. Without prejudice to the foregoing:
                  </p>

                  <p>
                    Subscription Services (Job Search and CV Search) are for a
                    minimum term of 3, 6, 9 or 12 months. In the event of early
                    termination, no refunds will be given due to the nature of
                    the product and services, outstanding invoices shall remain
                    payable, and the fees in respect of any outstanding minimum
                    term shall become payable. These services will either
                    automatically renew or with permission from the Client for a
                    further minimum term of 3, 6, 9 or 12 months on the terms
                    and fees as are applicable on the date immediately prior to
                    the relevant anniversary date, unless either party gives the
                    other written notice to terminate at least 28 days prior to
                    such anniversary. In the event of reducing the minimum term
                    from the original agreed term the Client shall give 28 days
                    notice and Educate Link shall reduce the term, however
                    Educate Link reserves the right to charge administration
                    fees and other fees based on usage. A 3 month original term
                    shall not be reduced further.
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

            {/* Service Modifications & Changes */}
            <Card>
              <CardHeader>
                <CardTitle>Service Modifications & Changes</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Educate Link may, in its sole and absolute discretion, add
                    to, modify or discontinue any of the Services from time to
                    time. However, this will not affect any Order Confirmation,
                    from Educate Link prior to any change or withdrawal of the
                    relevant Service.
                  </p>
                  <p>
                    Educate Link reserves the right to change the fees and/or
                    these Terms from time to time, provided that no change shall
                    be retrospective.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Good Faith Usage */}
            <Card>
              <CardHeader>
                <CardTitle>Good Faith Usage</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    The Client agrees to use the Website and the Services in
                    'good faith' i.e. to post authentic, impartial and unique
                    jobs of reasonable quality, which provide both adequate and
                    accurate job details. The Client also agrees that any abuse
                    of the Services, Website or these Terms can result in the
                    Client's access to the Services being removed, and its
                    account terminated.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Intellectual Property Rights */}
            <Card>
              <CardHeader>
                <CardTitle>Intellectual Property Rights</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    All intellectual property rights connected with the Services
                    and/or the Website shall remain vested in Educate Link or
                    HUSNAZ Ltd or any third party from whom such rights are
                    licensed. The Client shall not reproduce, copy, modify,
                    adapt, publish, transmit, distribute or in any way
                    commercially exploit any material which is subject to any
                    such intellectual property rights.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Force Majeure & Virus Protection */}
            <Card>
              <CardHeader>
                <CardTitle>Force Majeure & Virus Protection</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Educate Link shall not be in breach of these Terms if events
                    beyond its reasonable control prevent Educate Link from
                    performing the Services.
                  </p>
                  <p>
                    It is the Client's responsibility to protect their computers
                    against any viruses and malware.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Employee Solicitation */}
            <Card>
              <CardHeader>
                <CardTitle>Employee Solicitation</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    The Client undertakes not to solicit, or endeavour to
                    solicit, for employment or engagement with itself or any
                    associated company or organisation, any employee of Educate
                    Link or of any member of the Educate Link Group. Breach of
                    this clause shall be a material breach and will entitle
                    Educate Link, without prejudice to any other remedies it may
                    have, to terminate the Client's account and Services
                    immediately.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Claims Limitation */}
            <Card>
              <CardHeader>
                <CardTitle>Claims Limitation</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    The Client will not be entitled to bring any claim or legal
                    proceedings in respect of any refund or other repayment,
                    howsoever arising, 4 years after the date on which
                    entitlement to such refund or repayment arose. For the
                    avoidance of doubt, the Website terms and conditions apply
                    in addition to the above Terms.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Service Reselling */}
            <Card>
              <CardHeader>
                <CardTitle>Service Reselling</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    The Client shall not resell any Services without the express
                    written permission of Educate Link. Educate Link reserves
                    the right to impose any restrictions it deems fit should it
                    provide permission for the reselling of any of the Services.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Service Monitoring & Promotion */}
            <Card>
              <CardHeader>
                <CardTitle>Service Monitoring & Promotion</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    From time to time Educate Link will contact Clients in order
                    to evaluate the service they receive and also to promote
                    Educate Link's services and products. Educate Link monitors
                    the quality of vacancies from time to time in order to
                    provide a better service to candidates.
                  </p>
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
                    Applicants' responses will be forwarded by Educate Link by
                    e-mail subject to any filtering and ranking. The Client is
                    responsible for verifying the information contained in
                    applicants' responses and Educate Link accepts no
                    responsibility for the content of any such application. In
                    particular, but without limitation, the Client is
                    responsible for verifying the applicant's identity,
                    eligibility to work, experience, training, qualifications
                    and authorisations required by the Client, by law or by any
                    relevant professional body for the vacancy.
                  </p>

                  <p>
                    All and any subsequent dealings between the Client and any
                    applicant in connection with the applicant's response to the
                    job posting are the responsibility of the Client, and
                    Educate Link accepts no liability whatsoever therewith. The
                    Client will indemnify Educate Link against any Losses in
                    connection therewith.
                  </p>

                  <p>
                    The Client will comply with all applicable laws, including
                    without limitation: current data protection legislation and
                    the Equality Act 2010. By submitting a vacancy to the
                    Website, the Client thereby confirms that the content of the
                    vacancy complies with the Code of Practice on Employment
                    provided by the Equality and Human Rights Commission.
                  </p>

                  <p>
                    The Client, if an employment agency or an employment
                    business, will comply with the provisions of the Conduct of
                    Employment Agencies and Businesses Regulations 2003 ("the
                    Regulations") and the Employment Agencies Act 1973 in
                    relation to all vacancies posted on Educate Link's site,
                    communications with applicants and management of applicants'
                    details. The Client shall indemnify Educate Link against any
                    Losses in connection therewith.
                  </p>

                  <p>The Client shall not post any vacancy where:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      there is a risk to the health and safety of any applicant
                      at the location where the work is to be performed, unless
                      the Client undertakes to inform the candidates of such
                      risks and the steps taken to prevent or control such risks
                    </li>
                    <li>
                      the role involves working with vulnerable persons,
                      including without limitation persons under the age of 18
                      or persons in need of care and attention by reason of old
                      age, infirmity or any other circumstances, unless the
                      Client undertakes, in respect of the candidate to be
                      placed, (i) to obtain copies of any relevant
                      qualifications or authorisations of the candidate; (ii) to
                      obtain two references from persons who are not relatives
                      of the candidate; and (iii) to take all other reasonably
                      practicable steps, including without limitation complying
                      with all relevant laws, codes of practices and guidelines
                      issued by relevant authorities, to confirm that the
                      candidate is not unsuitable for the position concerned
                    </li>
                  </ul>

                  <p>
                    By posting any vacancy set out in sub-clauses above, the
                    Client is deemed to give the relevant undertakings. Where
                    the Client is an employment business or agency, the Client
                    shall offer copies of the documents obtained under
                    sub-clauses (i) and (ii) to the hirer.
                  </p>

                  <p>
                    The Client accepts responsibility for any detriment which it
                    may suffer or incur in respect of the engagement of an
                    applicant and shall hold Educate Link harmless against any
                    Losses in connection therewith. The Client shall use all
                    reasonable endeavours to ascertain that it will not be
                    detrimental to the interests of the applicant it intends to
                    engage (if any) to work for the Client in the vacancy
                    posted.
                  </p>

                  <p>
                    Educate Link reserves the right in its sole and absolute
                    discretion to remove any vacancy at any time without reason.
                    Examples of vacancies that may be removed include, but are
                    not limited to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      those that Educate Link considers illegal, inappropriate
                      or fraudulent
                    </li>
                    <li>
                      those that directly or indirectly require or ask for
                      application or registration fees
                    </li>
                    <li>
                      those that advertise, pyramid, network marketing or
                      get-rich-quick schemes
                    </li>
                    <li>
                      those that have been indiscriminately posted or duplicated
                      across multiple sectors
                    </li>
                    <li>
                      those that advertise websites, services, businesses,
                      business opportunities and/or contact details
                    </li>
                    <li>
                      those of Clients who solicit staff from any member of the
                      Educate Link Group
                    </li>
                  </ul>

                  <p>
                    Free job postings (if any) under Recruitment are allocated
                    to the Client as a company, firm or other organisation,
                    rather than to individual users or business units.
                    Franchised businesses are allocated free job postings
                    centrally - to be shared amongst its franchisees - and not
                    to each franchised operation.
                  </p>

                  <p>
                    Free job postings under free Recruitment are at the
                    discretion of Educate Link. Breach by the Client of any of
                    these Terms may result in the Recruitment Services being
                    withdrawn from the Client. In the event that the Client has
                    any outstanding debt owing to Educate Link, the free
                    Recruitment Services shall be withdrawn.
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
