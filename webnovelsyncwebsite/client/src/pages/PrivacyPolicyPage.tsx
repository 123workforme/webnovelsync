import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicyPage: React.FC = () => {
  const sections = [
    {
      title: "Interpretation and Definitions",
      content: [
        {
          subtitle: "Definitions",
          details: [
            <><strong>Extension</strong> refers to the WebnovelSync browser extension software program provided by the Company.</>,
            <><strong>Company</strong> (referred to as either 'the Company', 'We', 'Us' or 'Our' in this Agreement) refers to WebnovelSync.</>,
            <><strong>Personal Data</strong> is any information that relates to an identified or identifiable individual.</>,
            <><strong>Service</strong> refers to the Extension and the Website.</>,
            <><strong>Website</strong> refers to WebnovelSync, accessible from https://webnovelsync.com</>,
            <><strong>You</strong> means the individual accessing or using the Service.</>,
            <><strong>Supported Platforms</strong> include Webnovel, ScribbleHub, Archive of Our Own (AO3), FanFiction.net, RoyalRoad, Wattpad, Inkitt, and Tapas.</>
          ]
        }
      ]
    },
    {
      title: "Collecting and Using Your Personal Data",
      content: [
        {
          subtitle: "Types of Data Collected",
          details: [
            <><strong>Authentication Verification:</strong> Checks if you're logged into Supported Platforms (by examining page elements, not storing credentials)</>,
            <><strong>Website Content:</strong> Chapter text, metadata, and formatting from your stories on Supported Platforms</>,
            <><strong>User Preferences:</strong> Sync settings, platform configurations, and extension preferences</>
          ]
        },
        {
          subtitle: "Personal Data Collection",
          details: [
            "While using Our Service, We may collect certain personally identifiable information that can be used to contact or identify You, including:",
            "Session verification (checking if you're logged in, not storing passwords)",
            "Story content and metadata",
            "Sync preferences and settings"
          ]
        },
      ]
    },
    {
      title: "Tracking Technologies and Data Storage",
      content: [
        {
          subtitle: "Local Storage",
          details: [
            "We use Chrome's local storage APIs to store your data securely on your device.",
            <><strong>chrome.storage.local:</strong> Stores user preferences, sync settings, and story configurations</>,
            <><strong>chrome.storage.sync:</strong> Synchronizes basic preferences across your Chrome installations</>,
            "All data is encrypted using Chrome's built-in security mechanisms."
          ]
        },
        {
          subtitle: "Temporary Data Processing",
          details: [
            "During sync operations, chapter content is temporarily held in memory for processing.",
            "This data is not permanently stored and is cleared after sync completion.",
            "No content is transmitted to our servers during this process."
          ]
        }
      ]
    },
    {
      title: "Use of Your Personal Data",
      content: [
        {
          subtitle: "Primary Uses",
          details: [
            <><strong>To provide and maintain our Service:</strong> To ensure sync functionality works properly between your selected platforms.</>,
            <><strong>To manage Your Extension:</strong> To manage Your registration and provide access to Extension functionalities.</>,
            <><strong>For login verification:</strong> To check if you're already logged into Supported Platforms (without accessing passwords).</>,
            <><strong>To transfer content:</strong> To sync your stories and chapters between your selected platforms.</>,
            <><strong>To contact You:</strong> To contact You regarding updates, security notifications, or technical support when necessary.</>,
          ]
        },
        {
          subtitle: "Data Processing Legal Basis",
          details: [
            <><strong>Consent:</strong> You have given explicit consent for processing Personal Data for sync operations.</>,
            <><strong>Performance of Service:</strong> Processing is necessary to provide the sync functionality you requested.</>,
            <><strong>Legitimate Interests:</strong> Processing is necessary for improving and maintaining the Extension.</>
          ]
        }
      ]
    },
    {
      title: "Sharing of Your Personal Data",
      content: [
        {
          subtitle: "Third-Party Sharing",
          details: [
            <><strong>With Supported Platforms:</strong> We share content with platforms you explicitly select for syncing (Webnovel, ScribbleHub, AO3, FanFiction.net, RoyalRoad, Wattpad, Inkitt, Tapas).</>,
            <><strong>For Legal Compliance:</strong> We may disclose data if required by law or to protect our legal rights.</>,
            <><strong>With Your Consent:</strong> We may share data for other purposes with your explicit consent.</>
          ]
        },
        {
          subtitle: "What We Don't Share",
          details: [
            "We do not sell your personal data to third parties.",
            "We do not share your content with platforms you haven't selected.",
            "We do not collect or store your login passwords or credentials.",
            "We do not share your data for marketing purposes without consent."
          ]
        }
      ]
    },
    {
      title: "Data Retention and Transfer",
      content: [
        {
          subtitle: "Retention Period",
          details: [
            <><strong>Login Status:</strong> Not stored - checked each time you use the extension.</>,
            <><strong>User Preferences:</strong> Retained until you uninstall the Extension.</>,
            <><strong>Temporary Content:</strong> Deleted immediately after sync operations complete.</>
          ]
        },
        {
          subtitle: "Data Transfer",
          details: [
            "Your information is processed entirely locally on your device.",
            "Content transfers occur directly between your device and supported platforms.",
            "We have no servers - everything is processed locally on your device.",
            "All transfers use secure HTTPS connections."
          ]
        }
      ]
    },
    {
      title: "Security of Your Personal Data",
      content: [
        {
          subtitle: "Security Measures",
          details: [
            <><strong>Local Encryption:</strong> All stored data is encrypted using Chrome's security APIs.</>,
            <><strong>Secure Communication:</strong> All platform communications use HTTPS encryption.</>,
            <><strong>Access Control:</strong> Only you have access to your locally stored data.</>,
            <><strong>Regular Updates:</strong> We regularly update security measures and patch vulnerabilities.</>,
            <><strong>No Server Storage:</strong> We don't store your data on our servers, reducing breach risks.</>
          ]
        },
        {
          subtitle: "Security Limitations",
          details: [
            "While we implement strong security measures, no method of electronic storage is 100% secure.",
            "You are responsible for maintaining the security of your device and browser.",
            "Please report any suspected security issues to our support team immediately."
          ]
        }
      ]
    },
    {
      title: "Your Privacy Rights",
      content: [
        {
          subtitle: "General Rights",
          details: [
            <><strong>Access:</strong> You can view all stored data through the Extension interface.</>,
            <><strong>Correction:</strong> You can modify your preferences and settings at any time.</>,
            <><strong>Deletion:</strong> You can delete all data by uninstalling the Extension.</>,
            <><strong>Portability:</strong> You can export your settings and preferences.</>,
            <><strong>Withdrawal:</strong> You can revoke platform access permissions at any time.</>
          ]
        },
        {
          subtitle: "GDPR Rights (EU Users)",
          details: [
            <><strong>Right to Access:</strong> Request information about personal data we process.</>,
            <><strong>Right to Rectification:</strong> Request correction of inaccurate personal data.</>,
            <><strong>Right to Erasure:</strong> Request deletion of your personal data.</>,
            <><strong>Right to Restrict Processing:</strong> Request limitation of processing activities.</>,
            <><strong>Right to Data Portability:</strong> Receive your data in a machine-readable format.</>,
            <><strong>Right to Object:</strong> Object to processing based on legitimate interests.</>
          ]
        }
      ]
    },
    {
      title: "Third-Party Services",
      content: [
        {
          subtitle: "Supported Platforms",
          details: [
            "Each Supported Platform has its own privacy policy and terms of service.",
            "We only interact with these platforms as authorized by you.",
            "Your content on these platforms remains subject to their respective policies.",
            "We recommend reviewing each platform's privacy policy."
          ]
        }
      ]
    },
    {
      title: "Special Considerations",
      content: [
        {
          subtitle: "Children's Privacy",
          details: [
            "Our Service does not address anyone under the age of 13.",
            "We do not knowingly collect personal information from children under 13.",
            "If we discover that a child under 13 has provided personal information, we will delete it immediately.",
            "If you are a parent or guardian and believe your child has provided us with personal information, please contact us."
          ]
        },
        {
          subtitle: "Links to Other Websites",
          details: [
            "Our Service may contain links to other websites not operated by us.",
            "We have no control over and assume no responsibility for third-party sites.",
            "We strongly advise you to review the privacy policy of every site you visit.",
            "This privacy policy applies only to our Service."
          ]
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: 'rgba(5,5,5,0.9)', backdropFilter: 'blur(16px) saturate(180%)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="max-w-4xl mx-auto px-8 py-5 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <img src="/webnovelsync-icon.png" alt="" className="w-7 h-7" />
            <span className="font-body text-sm font-500 tracking-wide uppercase" style={{ letterSpacing: '0.15em' }}>WebnovelSync</span>
          </Link>
          <Link
            to="/"
            className="font-mono text-xs uppercase tracking-wider px-5 py-2.5 rounded-full transition-all duration-300"
            style={{ border: '1px solid var(--color-border-hover)' }}
          >
            Home
          </Link>
        </div>
      </nav>

      <section className="pt-36 pb-16 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-6 mb-10">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: 'var(--color-text-faint)' }}>Legal</span>
            <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
          </div>
          <h1 className="font-display text-5xl md:text-6xl" style={{ lineHeight: '1.1', letterSpacing: '-0.02em' }}>
            Privacy <em style={{ color: 'var(--color-blue)' }}>Policy</em>
          </h1>
          <p className="mt-4 font-mono text-xs uppercase tracking-wider" style={{ color: 'var(--color-text-faint)' }}>Effective July 26, 2025</p>
        </div>
      </section>

      <div className="h-px max-w-4xl mx-auto" style={{ background: 'var(--color-border)' }} />

      <section className="py-16 px-8">
        <div className="max-w-4xl mx-auto space-y-4 leading-relaxed" style={{ color: 'var(--color-text-dim)' }}>
          <p>This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the WebnovelSync browser extension and tells You about Your privacy rights and how the law protects You.</p>
          <p>We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.</p>
          <p>WebnovelSync is designed with privacy by design principles, storing data locally on your device and only transferring content to platforms you explicitly authorize.</p>
        </div>
      </section>

      <section className="py-12 px-8" style={{ background: 'var(--color-surface)' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl mb-10"><em>At a glance</em></h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { label: 'Collect', color: 'var(--color-blue)', items: ['Login status verification (no passwords)', 'User sync preferences', 'Chapter content (during sync only)'] },
              { label: 'Protect', color: 'var(--color-blue)', items: ['Local encryption of all data', 'No server-side storage', 'HTTPS for all communications'] },
              { label: 'Never', color: '#F87171', items: ['Sell your personal data', 'Store content on our servers', 'Share data without consent'] },
            ].map((col) => (
              <div key={col.label} className="p-6 rounded-xl" style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: col.color }}>{col.label}</span>
                <ul className="mt-4 space-y-2">
                  {col.items.map((item, i) => (
                    <li key={i} className="text-sm leading-relaxed" style={{ color: 'var(--color-text-dim)' }}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-8">
        <div className="max-w-4xl mx-auto space-y-20">
          {sections.map((section, index) => (
            <div key={index}>
              <div className="flex items-baseline gap-4 mb-8">
                <span className="font-mono text-xs" style={{ color: 'var(--color-text-faint)' }}>{String(index + 1).padStart(2, '0')}</span>
                <h2 className="font-display text-2xl"><em>{section.title}</em></h2>
              </div>
              <div className="space-y-8 ml-8">
                {section.content.map((item, iIdx) => (
                  <div key={iIdx}>
                    <h3 className="font-body font-500 text-base mb-4">{item.subtitle}</h3>
                    <ul className="space-y-3">
                      {item.details.map((detail, dIdx) => (
                        <li key={dIdx} className="text-sm leading-relaxed pl-4" style={{ color: 'var(--color-text-dim)', borderLeft: '1px solid var(--color-border)' }}>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="h-px max-w-4xl mx-auto" style={{ background: 'var(--color-border)' }} />

      <section className="py-16 px-8" style={{ background: 'var(--color-surface)' }}>
        <div className="max-w-4xl mx-auto space-y-12">
          <div>
            <h2 className="font-display text-2xl mb-6"><em>Policy Updates</em></h2>
            <div className="space-y-3 text-sm leading-relaxed" style={{ color: 'var(--color-text-dim)' }}>
              <p>We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page.</p>
              <p>We will let You know via email and/or a prominent notice within the Extension, prior to the change becoming effective.</p>
            </div>
          </div>
          <div>
            <h2 className="font-display text-2xl mb-6"><em>Contact</em></h2>
            <p className="text-sm mb-4" style={{ color: 'var(--color-text-dim)' }}>Questions about this Privacy Policy?</p>
            <a href="mailto:support@webnovelsync.com" className="font-mono text-sm hover:underline" style={{ color: 'var(--color-blue)' }}>support@webnovelsync.com</a>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--color-text-faint)' }}>Also for GDPR &amp; data protection requests</p>
          </div>
        </div>
      </section>

      <footer className="py-10 px-8" style={{ borderTop: '1px solid var(--color-border)' }}>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img src="/webnovelsync-icon.png" alt="" className="w-5 h-5 opacity-40" />
            <span className="font-mono text-xs uppercase tracking-[0.15em]" style={{ color: 'var(--color-text-faint)' }}>WebnovelSync</span>
          </div>
          <div className="flex items-center gap-8 font-mono text-xs" style={{ color: 'var(--color-text-faint)' }}>
            <Link to="/" className="hover:opacity-100 transition-opacity uppercase tracking-wider">Home</Link>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicyPage;
