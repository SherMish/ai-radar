export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-purple-500/5 to-pink-500/5" />
      
      <div className="relative container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto rounded-lg border bg-card/50 backdrop-blur-xl p-8">
          <h1 className="text-4xl font-bold mb-8 gradient-text">Terms of Service</h1>
          
          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using AI-Radar, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. User Accounts</h2>
              <p className="text-muted-foreground">
                To access certain features of the platform, you must register for an account. You agree to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Provide accurate information</li>
                <li>Maintain the security of your account</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Not share your account credentials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. User Content</h2>
              <p className="text-muted-foreground">
                When posting reviews or other content, you agree:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>To provide honest and accurate reviews</li>
                <li>Not to post false, misleading, or malicious content</li>
                <li>Not to violate any third-party rights</li>
                <li>To grant us a license to use and display your content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Prohibited Activities</h2>
              <p className="text-muted-foreground">
                You agree not to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Post spam or fraudulent reviews</li>
                <li>Harass other users</li>
                <li>Attempt to access restricted areas</li>
                <li>Use the platform for illegal purposes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Termination</h2>
              <p className="text-muted-foreground">
                We reserve the right to terminate or suspend your account and access to the platform at our sole discretion, without notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties, or for any other reason.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Disclaimer</h2>
              <p className="text-muted-foreground">
                The platform is provided &quot;as is&quot; without warranties of any kind. We do not guarantee the accuracy or reliability of any reviews or content posted by users.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Contact</h2>
              <p className="text-muted-foreground">
                For any questions about these Terms of Service, please contact us at:
                <br />
                Email: legal@ai-radar.com
              </p>
            </section>

            <p className="text-sm text-muted-foreground">
              Last Updated: March 21, 2024
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}