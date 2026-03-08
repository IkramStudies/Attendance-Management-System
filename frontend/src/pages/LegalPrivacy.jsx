import {
  ArrowLeft,
  Shield,
  Lock,
  Eye,
  Database,
  UserCheck,
  Globe,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    // Prefer previous page, fallback to register
    navigate(location.state?.from || "/register");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="relative w-full max-w-4xl">
        <div className="shadow-2xl" style={{ borderRadius: "8px" }}>
          <div
            className="bg-gray-900 px-4 sm:px-6 py-5 sm:py-6 relative overflow-hidden border-b-4 border-gray-700"
            style={{ borderRadius: "8px" }}
          >
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-white opacity-5 rounded-full -mr-16 sm:-mr-20 -mt-16 sm:-mt-20" />
            <div className="absolute bottom-0 left-0 w-24 sm:w-32 h-24 sm:h-32 bg-white opacity-5 rounded-full -ml-12 sm:-ml-16 -mb-12 sm:-mb-16" />

            <div className="relative z-10 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              {/* Back button */}
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-2 text-white hover:text-gray-300 font-semibold transition-colors self-start"
              >
                <ArrowLeft size={16} />
                Back
              </button>

              {/* Center content */}
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                  <Shield className="text-white" size={20} />
                </div>

                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                    Privacy Policy
                  </h1>
                  <p className="text-gray-400 text-xs">
                    Oasis Ascend Attendance Management System
                  </p>
                </div>

                {/* Mobile date */}
                <p className="text-gray-400 text-xs md:hidden">
                  Last Updated: December 30, 2025
                </p>
              </div>

              {/* Desktop date */}
              <p className="text-gray-400 text-xs hidden md:block mt-auto">
                Last Updated: December 30, 2025
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6 space-y-4">
            <div className="bg-gray-50 border-l-4 border-gray-600 p-3 flex items-start gap-3">
              <Lock className="text-gray-600 flex-shrink-0 mt-0.5" size={16} />
              <p className="text-gray-800 text-xs">
                At Oasis Ascend, we are committed to protecting your privacy and
                ensuring the security of your personal information. This Privacy
                Policy explains how we collect, use, and safeguard your data.
              </p>
            </div>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                1. Information We Collect
              </h2>

              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
                    <UserCheck size={16} className="text-gray-600" />
                    Personal Information
                  </h3>
                  <p className="text-sm text-gray-600 leading-tight">
                    When you register for Oasis Ascend, we collect the following
                    personal information:
                  </p>
                  <ul className="list-disc pl-4 mt-1 space-y-0.5 text-sm text-gray-600">
                    <li>Full name</li>
                    <li>Email address</li>
                    <li>Password (encrypted)</li>
                    <li>Organization or institution affiliation</li>
                    <li>Role or position (if applicable)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
                    <Database size={16} className="text-gray-600" />
                    Attendance Data
                  </h3>
                  <p className="text-sm text-gray-600 leading-tight">
                    As part of the attendance management functionality, we
                    collect and store:
                  </p>
                  <ul className="list-disc pl-4 mt-1 space-y-0.5 text-sm text-gray-600">
                    <li>Check-in and check-out times</li>
                    <li>Location data (if enabled by your organization)</li>
                    <li>Device information used for attendance marking</li>
                    <li>Attendance records and reports</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
                    <Eye size={16} className="text-gray-600" />
                    Usage Information
                  </h3>
                  <p className="text-sm text-gray-600 leading-tight">
                    We automatically collect certain information about your
                    device and how you interact with our service:
                  </p>
                  <ul className="list-disc pl-4 mt-1 space-y-0.5 text-sm text-gray-600">
                    <li>IP address and browser type</li>
                    <li>Device operating system</li>
                    <li>Pages visited and features used</li>
                    <li>Time and date of access</li>
                    <li>Referring website addresses</li>
                  </ul>
                </div>
              </div>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                2. How We Use Your Information
              </h2>
              <p className="text-sm text-gray-600 leading-tight mb-2">
                Oasis Ascend uses your information for the following purposes:
              </p>
              <ul className="list-disc pl-4 space-y-1 text-sm text-gray-600">
                <li>
                  To provide and maintain our attendance management service
                </li>
                <li>To authenticate your identity and manage your account</li>
                <li>To process and record attendance data</li>
                <li>
                  To generate reports and analytics for authorized
                  administrators
                </li>
                <li>
                  To send important notifications about your account or service
                  updates
                </li>
                <li>To improve our service and develop new features</li>
                <li>To detect and prevent fraud or security issues</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                3. Data Sharing and Disclosure
              </h2>
              <p className="text-sm text-gray-600 leading-tight mb-2">
                We respect your privacy and do not sell your personal
                information. We may share your data only in the following
                circumstances:
              </p>
              <div className="space-y-2 text-sm text-gray-600 leading-tight">
                <p>
                  <strong className="text-gray-900">
                    3.1 With Your Organization:
                  </strong>{" "}
                  Attendance data and related information may be shared with
                  authorized personnel within your organization (e.g.,
                  supervisors, HR departments, administrators).
                </p>
                <p>
                  <strong className="text-gray-900">
                    3.2 Service Providers:
                  </strong>{" "}
                  We may share data with trusted third-party service providers
                  who assist us in operating our platform, such as cloud hosting
                  services, provided they agree to keep your information
                  confidential.
                </p>
                <p>
                  <strong className="text-gray-900">
                    3.3 Legal Requirements:
                  </strong>{" "}
                  We may disclose your information if required by law, court
                  order, or governmental regulation.
                </p>
                <p>
                  <strong className="text-gray-900">
                    3.4 Business Transfers:
                  </strong>{" "}
                  In the event of a merger, acquisition, or sale of assets, your
                  information may be transferred to the new entity.
                </p>
              </div>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                4. Data Security
              </h2>
              <p className="text-sm text-gray-600 leading-tight">
                We implement industry-standard security measures to protect your
                personal information:
              </p>
              <ul className="list-disc pl-4 mt-2 space-y-1 text-sm text-gray-600">
                <li>Encryption of data in transit using SSL/TLS protocols</li>
                <li>
                  Secure password storage using advanced hashing algorithms
                </li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Access controls limiting who can view your information</li>
                <li>
                  Secure data centers with physical and digital protection
                </li>
                <li>Regular backups to prevent data loss</li>
              </ul>
              <p className="text-sm text-gray-600 leading-tight mt-2">
                While we strive to protect your data, no method of transmission
                over the internet is 100% secure. We cannot guarantee absolute
                security but continuously work to maintain the highest
                standards.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                5. Your Data Rights
              </h2>
              <p className="text-sm text-gray-600 leading-tight mb-2">
                You have the following rights regarding your personal data:
              </p>
              <ul className="list-disc pl-4 space-y-1 text-sm text-gray-600">
                <li>
                  <strong className="text-gray-900">Access:</strong> Request a
                  copy of the personal data we hold about you
                </li>
                <li>
                  <strong className="text-gray-900">Correction:</strong> Request
                  correction of inaccurate or incomplete data
                </li>
                <li>
                  <strong className="text-gray-900">Deletion:</strong> Request
                  deletion of your personal data (subject to legal retention
                  requirements)
                </li>
                <li>
                  <strong className="text-gray-900">Data Portability:</strong>{" "}
                  Request your data in a structured, machine-readable format
                </li>
                <li>
                  <strong className="text-gray-900">Objection:</strong> Object
                  to certain processing of your data
                </li>
                <li>
                  <strong className="text-gray-900">Withdrawal:</strong>{" "}
                  Withdraw consent for data processing where applicable
                </li>
              </ul>
              <p className="text-sm text-gray-600 leading-tight mt-2">
                To exercise these rights, please contact us at
                privacy@oasisascend.com
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                6. Data Retention
              </h2>
              <p className="text-sm text-gray-600 leading-tight">
                We retain your personal information for as long as necessary to
                fulfill the purposes outlined in this policy, unless a longer
                retention period is required by law. Attendance records may be
                retained according to your organization's policies and
                applicable legal requirements. When data is no longer needed, we
                securely delete or anonymize it.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                7. Cookies and Tracking
              </h2>
              <p className="text-sm text-gray-600 leading-tight">
                Oasis Ascend uses cookies and similar tracking technologies to
                enhance your experience. Cookies help us remember your
                preferences, authenticate your sessions, and analyze how you use
                our service. You can control cookie settings through your
                browser, but disabling cookies may affect functionality.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Globe size={20} className="text-gray-600" />
                8. International Data Transfers
              </h2>
              <p className="text-sm text-gray-600 leading-tight">
                Your information may be transferred to and stored on servers
                located outside your country of residence. We ensure that such
                transfers comply with applicable data protection laws and that
                appropriate safeguards are in place to protect your data.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                9. Children's Privacy
              </h2>
              <p className="text-sm text-gray-600 leading-tight">
                Oasis Ascend is not intended for use by individuals under the
                age of 18 without parental or guardian consent. We do not
                knowingly collect personal information from children. If we
                become aware that we have collected data from a child without
                proper consent, we will take steps to delete that information
                promptly.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                10. Changes to This Policy
              </h2>
              <p className="text-sm text-gray-600 leading-tight">
                We may update this Privacy Policy from time to time to reflect
                changes in our practices or for legal and regulatory reasons. We
                will notify you of any material changes by posting the updated
                policy on this page and updating the "Last Updated" date. We
                encourage you to review this policy periodically.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                11. Contact Us
              </h2>
              <p className="text-sm text-gray-600 leading-tight mb-2">
                If you have any questions, concerns, or requests regarding this
                Privacy Policy or how we handle your data, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-sm text-gray-700">
                <p>
                  <strong>Privacy Team:</strong> privacy@oasisascend.com
                </p>
                <p>
                  <strong>Data Protection Officer:</strong> dpo@oasisascend.com
                </p>
                <p>
                  <strong>General Support:</strong> support@oasisascend.com
                </p>
                <p className="pt-1 border-t border-gray-200 text-xs text-gray-600">
                  Oasis Ascend
                  <br />
                  Attention: Privacy Department
                </p>
              </div>
            </section>
            <div className="border-t-2 border-gray-200 pt-4 mt-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p className="text-xs text-gray-800 font-semibold mb-1">
                  Your Consent
                </p>
                <p className="text-sm text-gray-700">
                  By using Oasis Ascend, you consent to the collection and use
                  of your information as described in this Privacy Policy. If
                  you do not agree with this policy, please do not use our
                  service.
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center mt-6 text-gray-400 text-sm">
          © 2025 Oasis Ascend. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
