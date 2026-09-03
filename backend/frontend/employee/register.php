<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Employee Registration - META MINDS PVT LTD</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <link rel="icon" type="image/png" href="../assets/images/meta_minds_logo.png">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <style>
        .step-indicator {
            display: flex;
            justify-content: space-between;
            margin-bottom: 2rem;
            padding: 0 1rem;
        }

        .step {
            display: flex;
            flex-direction: column;
            align-items: center;
            flex: 1;
            position: relative;
        }

        .step-number {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: var(--gray-300);
            color: var(--gray-600);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            margin-bottom: 0.5rem;
            transition: all 0.3s;
        }

        .step.active .step-number {
            background: var(--primary);
            color: white;
        }

        .step.completed .step-number {
            background: var(--success);
            color: white;
        }

        .step-label {
            font-size: 0.75rem;
            color: var(--gray-500);
            text-align: center;
        }

        .step.active .step-label {
            color: var(--primary);
            font-weight: 600;
        }

        .step-content {
            display: none;
        }

        .step-content.active {
            display: block;
        }

        .step-actions {
            display: flex;
            justify-content: space-between;
            margin-top: 2rem;
            gap: 1rem;
        }

        .otp-section {
            display: flex;
            gap: 0.5rem;
            align-items: center;
        }

        .otp-input {
            width: 150px;
        }

        .signature-canvas {
            border: 2px dashed var(--gray-300);
            border-radius: 8px;
            background: white;
            cursor: crosshair;
        }

        .signature-options {
            display: flex;
            gap: 1rem;
            margin-bottom: 1rem;
        }

        .nda-section {
            background: var(--gray-50);
            padding: 1.5rem;
            border-radius: 8px;
            margin-top: 1rem;
            border: 1px solid var(--gray-200);
        }

        .nda-text {
            font-size: 0.875rem;
            color: var(--gray-600);
            line-height: 1.6;
            margin-bottom: 1rem;
            max-height: 200px;
            overflow-y: auto;
        }

        .checkbox-double {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .verification-badge {
            display: none;
            margin-left: .5rem;
            padding: .18rem .55rem;
            border-radius: 999px;
            background: #dcfce7;
            color: #166534;
            font-size: .72rem;
            font-weight: 700;
            vertical-align: middle;
        }

        .verification-badge.show {
            display: inline-block;
        }

        .nda-modal {
            display: none;
            position: fixed;
            inset: 0;
            z-index: 1000;
            padding: 1rem;
            background: rgba(15, 23, 42, .72);
        }

        .nda-modal.active {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .nda-modal-card {
            width: min(1100px, 100%);
            max-height: 94vh;
            overflow: hidden;
            border-radius: 12px;
            background: #fff;
            box-shadow: 0 24px 60px rgba(0, 0, 0, .32);
        }

        .nda-modal-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
            padding: 1rem 1.25rem;
            border-bottom: 1px solid var(--gray-200);
        }

        .nda-modal-body {
            display: grid;
            grid-template-columns: minmax(0, 1.3fr) minmax(330px, .7fr);
            height: min(74vh, 760px);
        }

        .nda-document {
            width: 100%;
            height: 100%;
            border: 0;
            background: var(--gray-100);
        }

        .nda-acceptance-form {
            overflow-y: auto;
            padding: 1.25rem;
            border-left: 1px solid var(--gray-200);
        }

        .nda-form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: .75rem;
        }

        .nda-check {
            display: flex;
            gap: .55rem;
            align-items: flex-start;
            margin: .8rem 0;
            font-size: .875rem;
        }

        .nda-status {
            margin-top: 1rem;
            padding: .8rem 1rem;
            border-radius: 8px;
            background: var(--gray-50);
            border: 1px solid var(--gray-200);
            font-size: .875rem;
        }

        .nda-status.accepted {
            color: #166534;
            background: #f0fdf4;
            border-color: #86efac;
        }

        @media (max-width: 760px) {
            .nda-modal {
                padding: 0;
            }

            .nda-modal-card {
                max-height: 100vh;
                border-radius: 0;
            }

            .nda-modal-body {
                display: block;
                height: calc(100vh - 69px);
            }

            .nda-document {
                height: 47%;
            }

            .nda-acceptance-form {
                height: 53%;
                border-left: 0;
                border-top: 1px solid var(--gray-200);
            }

            .nda-form-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
    <style>
        .page-loader {
            display: none;
            position: fixed;
            inset: 0;
            z-index: 99999;
            background: rgba(255, 255, 255, 0.85);
            align-items: center;
            justify-content: center;
        }

        .page-loader.active {
            display: flex;
        }

        .loader-spinner {
            width: 45px;
            height: 45px;
            border: 4px solid #ddd;
            border-top-color: #667eea;
            border-radius: 50%;
            animation: pageLoaderSpin 0.8s linear infinite;
        }

        @keyframes pageLoaderSpin {
            to {
                transform: rotate(360deg);
            }
        }

        .page-loader {
            display: none;
            position: fixed;
            inset: 0;
            z-index: 99999;
            background: rgba(255, 255, 255, 0.85);
            align-items: center;
            justify-content: center;
        }

        .page-loader.active {
            display: flex;
        }

        .loader-spinner {
            width: 45px;
            height: 45px;
            border: 4px solid #ddd;
            border-top-color: #667eea;
            border-radius: 50%;
            animation: pageLoaderSpin 0.8s linear infinite;
        }

        @keyframes pageLoaderSpin {
            from {
                transform: rotate(0deg);
            }

            to {
                transform: rotate(360deg);
            }
        }
    </style>
</head>

<body>
    <div class="login-page">
        <div class="login-container" style="max-width: 700px;">
            <div class="logo-container">
                <img class="company-logo company-logo-auth" src="../assets/images/meta_minds_logo.png" alt="META MINDS PVT LTD">
            </div>

            <div class="login-header">
                <h2>Employee Registration</h2>
                <p>Join our team</p>
            </div>

            <div class="step-indicator">
                <div class="step active" id="step1-indicator">
                    <div class="step-number">1</div>
                    <div class="step-label">Personal Details</div>
                </div>
                <div class="step" id="step2-indicator">
                    <div class="step-number">2</div>
                    <div class="step-label">Professional Details</div>
                </div>
                <div class="step" id="step3-indicator">
                    <div class="step-number">3</div>
                    <div class="step-label">Verification</div>
                </div>
            </div>

            <form id="registerForm">
                <!-- Step 1: Personal Details -->
                <div class="step-content active" id="step1">
                    <h3 style="margin-bottom: 1rem;">Personal Information</h3>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div class="form-group">
                            <label class="form-label">First Name *</label>
                            <input type="text" class="form-control" id="firstName" placeholder="Enter your first name" autocomplete="given-name">
                            <div class="error-message" id="firstNameError"></div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Last Name *</label>
                            <input type="text" class="form-control" id="lastName" placeholder="Enter your last name" autocomplete="family-name">
                            <div class="error-message" id="lastNameError"></div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Mobile Number *</label>
                        <input type="tel" class="form-control" id="phone" placeholder="Enter your phone number" maxlength="10" autocomplete="tel">
                        <div class="error-message" id="phoneError"></div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
                        <div class="form-group">
                            <label class="form-label">Date of Birth *</label>
                            <input type="date" class="form-control" id="dateOfBirth" autocomplete="bday">
                            <div class="error-message" id="dateOfBirthError"></div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Age *</label>
                            <input type="number" class="form-control" id="age" placeholder="Age" min="18" max="65">
                            <div class="error-message" id="ageError"></div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Gender *</label>
                            <select class="form-control" id="gender">
                                <option value="">Choose...</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                            <div class="error-message" id="genderError"></div>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-top: 1rem;">
                        <div class="form-group">
                            <label class="form-label">Blood Group *</label>
                            <select class="form-control" id="bloodGroup">
                                <option value="">Choose...</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </select>
                            <div class="error-message" id="bloodGroupError"></div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Aadhaar Card Number</label>
                            <input type="text" class="form-control" id="aadhaarNumber" placeholder="Enter your Aadhaar number" maxlength="12" autocomplete="off">
                            <div class="error-message" id="aadhaarNumberError"></div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">PAN Card Number</label>
                            <input type="text" class="form-control" id="panNumber" placeholder="Enter your PAN number" maxlength="10" autocomplete="off">
                            <div class="error-message" id="panNumberError"></div>
                        </div>
                    </div>

                    <div style="margin-top: 1.5rem;">
                        <h3>Document Uploads</h3>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div class="form-group">
                            <label class="form-label">Aadhaar Card (Front) *</label>
                            <input type="file" class="form-control" id="aadhaarFront" accept="image/*,.pdf">
                            <div class="error-message" id="aadhaarFrontError"></div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Aadhaar Card (Back) *</label>
                            <input type="file" class="form-control" id="aadhaarBack" accept="image/*,.pdf">
                            <div class="error-message" id="aadhaarBackError"></div>
                        </div>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr; gap: 1rem; margin-top: 1rem;">
                        <div class="form-group">
                            <label class="form-label">PAN Card (Front) *</label>
                            <input type="file" class="form-control" id="panFront" accept="image/*,.pdf">
                            <div class="error-message" id="panFrontError"></div>
                        </div>
                    </div>

                    <div style="margin-top: 1.5rem;">
                        <h3>Emergency Contact</h3>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
                        <div class="form-group">
                            <label class="form-label">Contact Person Name *</label>
                            <input type="text" class="form-control" id="emergencyContactName" placeholder="Contact person name">
                            <div class="error-message" id="emergencyContactNameError"></div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Relationship *</label>
                            <input type="text" class="form-control" id="emergencyContactRelationship" placeholder="Relationship">
                            <div class="error-message" id="emergencyContactRelationshipError"></div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Emergency Contact Number *</label>
                            <input type="tel" class="form-control" id="emergencyContactNumber" placeholder="Emergency phone" maxlength="10">
                            <div class="error-message" id="emergencyContactNumberError"></div>
                        </div>
                    </div>

                    <div style="margin-top: 1.5rem;">
                        <h3>Address Details</h3>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
                        <div class="form-group">
                            <label class="form-label">Door / House Number *</label>
                            <input type="text" class="form-control" id="doorNumber" placeholder="Door / house number">
                            <div class="error-message" id="doorNumberError"></div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Street *</label>
                            <input type="text" class="form-control" id="street" placeholder="Street">
                            <div class="error-message" id="streetError"></div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Area / Locality *</label>
                            <input type="text" class="form-control" id="areaLocality" placeholder="Area / locality">
                            <div class="error-message" id="areaLocalityError"></div>
                        </div>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-top: 1rem;">
                        <div class="form-group">
                            <label class="form-label">City *</label>
                            <input type="text" class="form-control" id="city" placeholder="City" autocomplete="address-level2">
                            <div class="error-message" id="cityError"></div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">District *</label>
                            <input type="text" class="form-control" id="district" placeholder="District">
                            <div class="error-message" id="districtError"></div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">State *</label>
                            <input type="text" class="form-control" id="state" placeholder="State" autocomplete="address-level1">
                            <div class="error-message" id="stateError"></div>
                        </div>
                    </div>
                    <div class="form-group" style="margin-top: 1rem;">
                        <label class="form-label">Pincode *</label>
                        <input type="text" class="form-control" id="pincode" placeholder="Pincode" autocomplete="postal-code">
                        <div class="error-message" id="pincodeError"></div>
                    </div>

                    <div class="step-actions">
                        <button type="button" class="btn btn-secondary" id="prevStep1" style="visibility: hidden;">Previous</button>
                        <button type="button" class="btn btn-primary" id="nextStep1">Next Step</button>
                    </div>
                </div>

                <!-- Step 2: Professional Details -->
                <div class="step-content" id="step2">
                    <h3 style="margin-bottom: 1rem;">Professional Information</h3>

                    <div class="form-group">
                        <label class="form-label">Higher Education *</label>
                        <select class="form-control" id="higherEducation">
                            <option value="">Select Education Level</option>
                            <option value="10th">10th Standard</option>
                            <option value="intermediate">Intermediate (12th)</option>
                            <option value="diploma">Diploma</option>
                            <option value="degree">Degree</option>
                            <option value="btech">B.Tech/B.E</option>
                            <option value="mtech">M.Tech/M.E</option>
                            <option value="mca">MCA</option>
                            <option value="mba">MBA</option>
                            <option value="other">Other</option>
                        </select>
                        <div class="error-message" id="higherEducationError"></div>
                    </div>

                    <div id="educationDocuments" style="display: none;">
                        <div style="margin-top: 1rem;">
                            <h3>Education Documents</h3>
                        </div>
                        <div id="educationFileUploads"></div>
                    </div>

                    <div class="form-group" style="margin-top: 1.5rem;">
                        <label class="form-label">Department *</label>
                        <select class="form-control" id="department">
                            <option value="">Select Department</option>
                            <option value="Engineering">Engineering</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Sales">Sales</option>
                            <option value="HR">HR</option>
                            <option value="Finance">Finance</option>
                            <option value="Operations">Operations</option>
                            <option value="IT">IT</option>
                        </select>
                        <div class="error-message" id="departmentError"></div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Designation *</label>
                        <input type="text" class="form-control" id="designation" placeholder="Enter your designation" autocomplete="organization-title">
                        <div class="error-message" id="designationError"></div>
                    </div>

                    <div class="form-group" style="margin-top: 1.5rem;">
                        <label class="form-label">Experience Level *</label>
                        <select class="form-control" id="experienceLevel">
                            <option value="">Select Experience Level</option>
                            <option value="fresher">Fresher</option>
                            <option value="experienced">Experienced</option>
                        </select>
                        <div class="error-message" id="experienceLevelError"></div>
                    </div>

                    <div id="experienceDetails" style="display: none;">
                        <div style="margin-top: 1rem;">
                            <h3>Experience Details</h3>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <div class="form-group">
                                <label class="form-label">Company Name *</label>
                                <input type="text" class="form-control" id="companyName" placeholder="Enter company name">
                                <div class="error-message" id="companyNameError"></div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Company Contact Number *</label>
                                <input type="tel" class="form-control" id="companyContact" placeholder="Enter company contact number" maxlength="10">
                                <div class="error-message" id="companyContactError"></div>
                            </div>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-top: 1rem;">
                            <div class="form-group">
                                <label class="form-label">Experience Letter *</label>
                                <input type="file" class="form-control" id="experienceLetter" accept="image/*,.pdf">
                                <div class="error-message" id="experienceLetterError"></div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Pay Slip *</label>
                                <input type="file" class="form-control" id="paySlip" accept="image/*,.pdf">
                                <div class="error-message" id="paySlipError"></div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Offer Letter *</label>
                                <input type="file" class="form-control" id="offerLetter" accept="image/*,.pdf">
                                <div class="error-message" id="offerLetterError"></div>
                            </div>
                        </div>
                    </div>

                    <div class="step-actions">
                        <button type="button" class="btn btn-secondary" id="prevStep2">Previous</button>
                        <button type="button" class="btn btn-primary" id="nextStep2">Next Step</button>
                    </div>
                </div>

                <!-- Step 3: Verification & Final -->
                <div class="step-content" id="step3">
                    <h3 style="margin-bottom: 1rem;">Verification & Final Details</h3>

                    <div class="form-group">
                        <label class="form-label">Email Address * <span class="verification-badge" id="emailVerifiedBadge">✓ Verified</span></label>
                        <div class="otp-section">
                            <input type="email" class="form-control" id="email" placeholder="Enter your email" autocomplete="email" style="flex: 1;">
                            <button type="button" class="btn btn-secondary" id="sendOtpBtn">Send OTP</button>
                        </div>
                        <div class="error-message" id="emailError"></div>
                    </div>

                    <div class="form-group" id="otpSection" style="display: none;">
                        <label class="form-label">Email OTP *</label>
                        <div class="otp-section">
                            <input type="text" class="form-control otp-input" id="otpInput" placeholder="Enter the 6-digit OTP sent to your email" inputmode="numeric" autocomplete="one-time-code" maxlength="6">
                            <button type="button" class="btn btn-primary" id="verifyOtpBtn">Verify Email</button>
                        </div>
                        <div class="error-message" id="otpError"></div>
                        <div id="otpStatus" style="color: var(--gray-500); font-size: .875rem; margin-top: .5rem; display: none;"></div>
                        <div id="otpVerified" style="color: var(--success); font-size: 0.875rem; margin-top: 0.5rem; display: none;">✓ Email verified successfully</div>
                    </div>

                    <div class="form-group" style="margin-top: 1.5rem;">
                        <label class="form-label">Position *</label>
                        <select class="form-control" id="position">
                            <option value="">Select Position</option>
                            <option value="employee">Employee</option>
                            <option value="intern">Intern</option>
                        </select>
                        <div class="error-message" id="positionError"></div>
                    </div>

                    <div class="form-group" style="margin-top: 1.5rem;">
                        <label class="form-label">Password *</label>
                        <input type="password" class="form-control" id="password" placeholder="Create a password" autocomplete="new-password">
                        <div class="error-message" id="passwordError"></div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Confirm Password *</label>
                        <input type="password" class="form-control" id="confirmPassword" placeholder="Confirm password" autocomplete="new-password">
                        <div class="error-message" id="confirmPasswordError"></div>
                    </div>

                    <div class="form-group" style="margin-top: 1.5rem;">
                        <label class="form-label">Signature *</label>
                        <div class="signature-options">
                            <button type="button" class="btn btn-secondary btn-sm" id="uploadSignatureBtn">Upload Signature</button>
                            <button type="button" class="btn btn-secondary btn-sm" id="drawSignatureBtn">Draw Signature</button>
                        </div>
                        <input type="file" class="form-control" id="signatureUpload" accept="image/*" style="display: none;">
                        <canvas id="signatureCanvas" class="signature-canvas" width="500" height="150" style="display: none;"></canvas>
                        <div style="margin-top: 0.5rem;">
                            <button type="button" class="btn btn-secondary btn-sm" id="clearSignatureBtn" style="display: none;">Clear Signature</button>
                        </div>
                        <div class="error-message" id="signatureError"></div>
                    </div>

                    <div class="form-group" style="margin-top: 1.5rem;">
                        <label class="form-label">Live Photo *</label>
                        <div class="camera-capture">
                            <video id="cameraPreview" class="camera-preview" autoplay muted playsinline></video>
                            <img id="photoPreview" class="photo-preview" alt="Captured live photo" style="display: none;">
                            <p id="cameraMessage" style="color: var(--gray-500); font-size: 0.875rem;">Use your camera to take a live photo.</p>
                            <div class="camera-actions">
                                <button type="button" class="btn btn-secondary btn-sm" id="startCameraBtn">Start Camera</button>
                                <button type="button" class="btn btn-primary btn-sm" id="capturePhotoBtn" disabled>Take Photo</button>
                                <button type="button" class="btn btn-secondary btn-sm" id="retakePhotoBtn" style="display: none;">Retake</button>
                            </div>
                        </div>
                        <div class="error-message" id="photoError"></div>
                    </div>

                    <div class="nda-section">
                        <h4 style="margin-bottom: .5rem;">Agreement acceptance *</h4>
                        <p style="margin: 0; color: var(--gray-600); font-size: .9rem;">Choose your position to open and accept the applicable META MINDS agreement.</p>
                        <div class="nda-status" id="ndaStatus">No agreement accepted yet.</div>
                        <div class="error-message" id="ndaError"></div>
                    </div>

                    <div class="step-actions">
                        <button type="button" class="btn btn-secondary" id="prevStep3">Previous</button>
                        <button type="submit" class="btn btn-primary" id="submitBtn">
                            <span id="btnText">Submit Registration</span>
                            <span id="btnSpinner" class="spinner" style="display: none;"></span>
                        </button>
                    </div>
                </div>

                <div id="alertContainer"></div>
            </form>

            <div style="text-align: center; margin-top: 1.5rem;">
                <a href="login.php" style="color: var(--primary); text-decoration: none; font-weight: 500;">Already registered? Login here</a>
            </div>
        </div>
    </div>

    <div class="nda-modal" id="ndaModal" role="dialog" aria-modal="true" aria-labelledby="ndaModalTitle">
        <div class="nda-modal-card">
            <div class="nda-modal-header">
                <div><strong id="ndaModalTitle">META MINDS Agreement</strong>
                    <div style="font-size: .8rem; color: var(--gray-500);">Read the complete agreement and submit the electronic acceptance form.</div>
                </div>
                <button type="button" class="btn btn-secondary btn-sm" id="cancelNdaBtn">Cancel</button>
            </div>
            <div class="nda-modal-body">
                <iframe class="nda-document" id="ndaDocument" title="META MINDS agreement document"></iframe>
                <form class="nda-acceptance-form" id="ndaAcceptanceForm">
                    <h3 id="ndaFormHeading" style="margin-top: 0;">Electronic acceptance</h3>
                    <div class="nda-form-grid">
                        <div class="form-group"><label class="form-label">Full name *</label><input class="form-control" id="ndaFullName" required readonly></div>
                        <div class="form-group"><label class="form-label">Email *</label><input class="form-control" id="ndaEmail" required readonly></div>
                        <div class="form-group"><label class="form-label">Mobile *</label><input class="form-control" id="ndaMobile" required readonly></div>
                        <div class="form-group"><label class="form-label" id="ndaPositionLabel">Position *</label><input class="form-control" id="ndaPosition" required readonly></div>
                        <div class="form-group"><label class="form-label">Department *</label><input class="form-control" id="ndaDepartment" required readonly></div>
                        <div class="form-group"><label class="form-label">Designation *</label><input class="form-control" id="ndaDesignation" required readonly></div>
                        <div class="form-group"><label class="form-label" id="ndaDateLabel">Date of joining *</label><input class="form-control" type="date" id="ndaStartDate" required></div>
                        <div class="form-group"><label class="form-label" id="ndaManagerLabel">Reporting manager / mentor</label><input class="form-control" id="ndaManager" placeholder="Assigned by HR if not known"></div>
                        <div class="form-group" id="ndaAddressGroup"><label class="form-label">Company address *</label><input class="form-control" id="ndaCompanyAddress" required placeholder="META MINDS registered office address"></div>
                    </div>
                    <label class="nda-check"><input type="checkbox" id="ndaCheckbox1" required> <span>I have read and understood the complete agreement. *</span></label>
                    <label class="nda-check"><input type="checkbox" id="ndaCheckbox2" required> <span id="ndaTermsLabel">I agree to the terms and conditions of this agreement. *</span></label>
                    <label class="nda-check"><input type="checkbox" id="ndaCheckbox3" required> <span>I confirm that the information provided by me is true and correct. *</span></label>
                    <div class="form-group"><label class="form-label">Type your full legal name to accept *</label><input class="form-control" id="ndaTypedName" required placeholder="Full legal name"></div>
                    <div class="error-message" id="ndaModalError"></div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">I Agree &amp; Accept</button>
                </form>
            </div>
        </div>
    </div>

    <script src="../assets/js/employee-register.js?v=20260816-11"></script>
    <div id="pageLoader" class="page-loader">
        <div class="loader-spinner"></div>
    </div>
</body>

</html>