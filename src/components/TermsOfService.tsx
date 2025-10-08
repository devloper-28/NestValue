import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function TermsOfService() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Agreement to Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                These Terms of Service ("Terms") govern your use of the NestValue.us website 
                ("Service") operated by NestValue ("us", "we", or "our"). By accessing or 
                using our Service, you agree to be bound by these Terms.
              </p>
              <p>
                If you disagree with any part of these terms, then you may not access the Service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Use License</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Permission is granted to temporarily download one copy of the materials on 
                NestValue.us for personal, non-commercial transitory viewing only. This is 
                the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose or for any public display</li>
                <li>attempt to reverse engineer any software contained on the website</li>
                <li>remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Investment Advice Disclaimer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                <strong className="text-foreground">Important:</strong> The information provided 
                on this website is for educational and informational purposes only. It does not 
                constitute financial, investment, or professional advice.
              </p>
              <p>
                Our investment calculator and forecasts are based on historical data and statistical 
                models. Past performance does not guarantee future results. All investments carry 
                risk, and you may lose money.
              </p>
              <p>
                Before making any investment decisions, you should:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Consult with a qualified financial advisor</li>
                <li>Consider your financial situation and risk tolerance</li>
                <li>Research investments thoroughly</li>
                <li>Understand all associated risks</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">User Accounts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                When you create an account with us, you must provide information that is accurate, 
                complete, and current at all times. You are responsible for safeguarding the password 
                and for all activities that occur under your account.
              </p>
              <p>
                You may not use as a username the name of another person or entity or that is not 
                lawfully available for use, a name or trademark that is subject to any rights of 
                another person or entity other than you without appropriate authorization, or a name 
                that is otherwise offensive, vulgar or obscene.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Prohibited Uses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>You may not use our Service:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>To submit false or misleading information</li>
                <li>To upload or transmit viruses or any other type of malicious code</li>
                <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
                <li>For any obscene or immoral purpose</li>
                <li>To interfere with or circumvent the security features of the Service</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Our Service allows you to post, link, store, share and otherwise make available 
                certain information, text, graphics, videos, or other material ("Content"). You 
                are responsible for the Content that you post to the Service, including its legality, 
                reliability, and appropriateness.
              </p>
              <p>
                By posting Content to the Service, you grant us the right and license to use, 
                modify, publicly perform, publicly display, reproduce, and distribute such Content 
                on and through the Service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Your privacy is important to us. Please review our Privacy Policy, which also 
                governs your use of the Service, to understand our practices.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Termination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We may terminate or suspend your account and bar access to the Service immediately, 
                without prior notice or liability, under our sole discretion, for any reason whatsoever 
                and without limitation, including but not limited to a breach of the Terms.
              </p>
              <p>
                If you wish to terminate your account, you may simply discontinue using the Service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Disclaimer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                The information on this Service is provided on an "as is" basis. To the fullest 
                extent permitted by law, this Company:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>excludes all representations and warranties relating to this website and its contents</li>
                <li>excludes all liability for damages arising out of or in connection with your use of this website</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Governing Law</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                These Terms shall be interpreted and governed by the laws of the United States, 
                without regard to its conflict of law provisions. Our failure to enforce any right 
                or provision of these Terms will not be considered a waiver of those rights.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at 
                any time. If a revision is material, we will provide at least 30 days notice prior 
                to any new terms taking effect.
              </p>
              <p>
                By continuing to access or use our Service after those revisions become effective, 
                you agree to be bound by the revised terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                In no event shall NestValue, nor its directors, employees, partners, agents, suppliers, or affiliates, 
                be liable for any indirect, incidental, special, consequential, or punitive damages, including without 
                limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your 
                use of the Service.
              </p>
              <p>
                Our total liability to you for all damages shall not exceed the amount you paid us for the Service 
                in the 12 months preceding the claim, or $100, whichever is greater.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Indemnification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                You agree to defend, indemnify, and hold harmless NestValue and its licensee and licensors, and their 
                employees, contractors, agents, officers and directors, from and against any and all claims, damages, 
                obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees).
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Severability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining 
                provisions of these Terms will remain in effect. These Terms constitute the entire agreement between 
                us regarding our Service, and supersede and replace any prior agreements we might have between us regarding the Service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>If you have any questions about these Terms of Service, please contact us:</p>
              <div className="bg-muted p-4 rounded-lg">
                <p><strong>Email:</strong> legal@nestvalue.us</p>
                <p><strong>Website:</strong> https://nestvalue.us</p>
                <p><strong>Address:</strong> NestValue, United States</p>
                <p><strong>Business Hours:</strong> Monday-Friday, 9 AM - 6 PM EST</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
