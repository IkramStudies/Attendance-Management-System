import { ArrowLeft, FileText, Shield, AlertCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const TermsAndConditions = () => {
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
                  <FileText className="text-white" size={20} />
                </div>

                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                    Terms & Conditions
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
            <div className="bg-blue-50 border-l-4 border-blue-600 p-3 flex items-start gap-3">
              <AlertCircle
                className="text-blue-600 flex-shrink-0 mt-0.5"
                size={16}
              />
              <p className="text-blue-800 text-xs">
                Please read these terms and conditions carefully before using
                our service. By accessing or using Oasis Ascend, you agree to be
                bound by these terms.
              </p>
            </div>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                1. Acceptance of Terms
              </h2>
              <p className="text-sm text-gray-600 leading-tight">
                By creating an account and using the Oasis Ascend attendance
                management system, you acknowledge that you have read,
                understood, and agree to be bound by these Terms and Conditions.
                If you do not agree with any part of these terms, you may not
                use our service.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                2. Use of Service
              </h2>
              <div className="space-y-2 text-sm text-gray-600 leading-tight ">
                <p>
                  <strong className="text-gray-900">2.1 Eligibility:</strong>{" "}
                  You must be at least 18 years old or have parental consent to
                  use this service. By using Oasis Ascend, you represent that
                  you meet these requirements.
                </p>
                <p>
                  <strong className="text-gray-900">
                    2.2 Account Responsibility:
                  </strong>{" "}
                  You are responsible for maintaining the confidentiality of
                  your account credentials and for all activities that occur
                  under your account.
                </p>
                <p>
                  <strong className="text-gray-900">
                    2.3 Accurate Information:
                  </strong>{" "}
                  You agree to provide accurate, current, and complete
                  information during registration and to update such information
                  to keep it accurate and current.
                </p>
              </div>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                3. User Conduct
              </h2>
              <p className="text-sm text-gray-600 leading-tight mb-2">
                You agree not to use the service to:
              </p>
              <ul className="list-disc pl-4 space-y-1 text-sm text-gray-600">
                <li>Violate any applicable laws or regulations</li>
                <li>
                  Impersonate any person or entity or misrepresent your
                  affiliation
                </li>
                <li>Transmit any harmful or malicious code</li>
                <li>Interfere with or disrupt the service or servers</li>
                <li>
                  Attempt to gain unauthorized access to any part of the service
                </li>
                <li>
                  Use automated systems to access the service without permission
                </li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                4. Attendance Data
              </h2>
              <p className="text-sm text-gray-600 leading-tight">
                All attendance records and data entered into the system remain
                the property of the respective organization. Oasis Ascend acts
                as a data processor and will handle all data in accordance with
                our Privacy Policy and applicable data protection regulations.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                5. Intellectual Property
              </h2>
              <p className="text-sm text-gray-600 leading-tight">
                The Oasis Ascend platform, including its original content,
                features, and functionality, is owned by Oasis Ascend and is
                protected by international copyright, trademark, and other
                intellectual property laws. You may not reproduce, distribute,
                or create derivative works without our express written
                permission.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                6. Service Availability
              </h2>
              <p className="text-sm text-gray-600 leading-tight">
                We strive to provide uninterrupted service but do not guarantee
                that the service will be available at all times. We reserve the
                right to modify, suspend, or discontinue the service at any time
                without prior notice.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                7. Limitation of Liability
              </h2>
              <p className="text-sm text-gray-600 leading-tight">
                To the maximum extent permitted by law, Oasis Ascend shall not
                be liable for any indirect, incidental, special, consequential,
                or punitive damages resulting from your use of or inability to
                use the service.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                8. Termination
              </h2>
              <p className="text-sm text-gray-600 leading-tight">
                We reserve the right to terminate or suspend your account and
                access to the service immediately, without prior notice, for any
                reason, including if you breach these Terms and Conditions.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                9. Changes to Terms
              </h2>
              <p className="text-sm text-gray-600 leading-tight">
                We reserve the right to modify these terms at any time. We will
                notify users of any material changes by posting the new Terms
                and Conditions on this page and updating the "Last Updated"
                date. Your continued use of the service after such changes
                constitutes acceptance of the new terms.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                10. Governing Law
              </h2>
              <p className="text-sm text-gray-600 leading-tight">
                These Terms and Conditions shall be governed by and construed in
                accordance with the laws of the jurisdiction in which Oasis
                Ascend operates, without regard to its conflict of law
                provisions.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                11. Contact Information
              </h2>
              <p className="text-sm text-gray-600 leading-tight">
                If you have any questions about these Terms and Conditions,
                please contact us at:
              </p>
              <div className="mt-2 bg-gray-50 rounded-lg p-3 space-y-1 text-sm text-gray-700">
                <p>
                  <strong>Email:</strong> legal@oasisascend.com
                </p>
                <p>
                  <strong>Support:</strong> support@oasisascend.com
                </p>
              </div>
            </section>
            <div className="border-t-2 border-gray-200 pt-4 mt-6">
              <p className="text-sm text-gray-700 text-center">
                By clicking "Create Account" on the registration page, you
                acknowledge that you have read and agree to these Terms &
                Conditions.
              </p>
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

export default TermsAndConditions;
