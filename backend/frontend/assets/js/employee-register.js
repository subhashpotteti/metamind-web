// Employee Registration JavaScript
document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('registerForm');
    const photoPreview = document.getElementById('photoPreview');
    const cameraPreview = document.getElementById('cameraPreview');
    const cameraMessage = document.getElementById('cameraMessage');
    const startCameraBtn = document.getElementById('startCameraBtn');
    const capturePhotoBtn = document.getElementById('capturePhotoBtn');
    const retakePhotoBtn = document.getElementById('retakePhotoBtn');
    const btnText = document.getElementById('btnText');
    const btnSpinner = document.getElementById('btnSpinner');
    const pageLoader = document.getElementById('pageLoader');


    // Do not initialize on a page that does not include the registration form.
    // This also prevents a cached/partially deployed page from crashing.
    const requiredElements = [
        registerForm, photoPreview, cameraPreview, cameraMessage,
        startCameraBtn, capturePhotoBtn, retakePhotoBtn, btnText, btnSpinner
    ];
    if (requiredElements.some(element => !element)) {
        console.error('Registration form is missing one or more required camera controls.');
        return;
    }

    let uploadedPhoto = null;
    let uploadedSignature = null;
    let cameraStream = null;
    let emailVerified = false;
    let ndaAcceptance = null;
    let signatureDrawing = false;
    let signatureHasInk = false;
    let uploadedFiles = {
        aadhaarFront: null,
        aadhaarBack: null,
        panFront: null,
        educationDocs: {},
        experienceLetter: null,
        paySlip: null,
        offerLetter: null
    };

    function setError(errorId, message) {
        const error = document.getElementById(errorId);
        if (!error) return;
        error.textContent = message;
        error.classList.toggle('show', Boolean(message));
    }

    function showStep(stepNumber) {
        document.querySelectorAll('.step-content').forEach(step => step.classList.remove('active'));
        document.querySelectorAll('.step').forEach((step, index) => {
            step.classList.toggle('active', index + 1 === stepNumber);
            step.classList.toggle('completed', index + 1 < stepNumber);
        });
        document.getElementById(`step${stepNumber}`).classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function validateStep(stepNumber) {
        const step = document.getElementById(`step${stepNumber}`);
        let valid = true;
        step.querySelectorAll('input, select').forEach(input => {
            if (input.type === 'file' || input.type === 'checkbox' || input.disabled) return;
            const field = fields[input.id];
            if (field && !field.validate(input.value)) valid = false;
        });

        if (stepNumber === 1) {
            [['aadhaarFront', 'aadhaarFrontError', 'Aadhaar front is required'], ['aadhaarBack', 'aadhaarBackError', 'Aadhaar back is required'], ['panFront', 'panFrontError', 'PAN card front is required']]
                .forEach(([key, errorId, message]) => {
                    if (!uploadedFiles[key]) { setError(errorId, message); valid = false; }
                });
        }
        if (stepNumber === 2 && document.getElementById('higherEducation').value) {
            getRequiredEducationDocs(document.getElementById('higherEducation').value).forEach(doc => {
                if (!uploadedFiles.educationDocs[doc]) valid = false;
            });
        }
        return valid;
    }

    // Helper functions
    function handleHigherEducationChange() {
        const value = this.value;
        const educationDocuments = document.getElementById('educationDocuments');
        const educationFileUploads = document.getElementById('educationFileUploads');

        if (value && value !== '') {
            educationDocuments.style.display = 'block';
            educationFileUploads.innerHTML = generateEducationFileUploads(value);
            const docTypes = getRequiredEducationDocs(value);
            docTypes.forEach(docType => {
                setupFileUpload(docType, `${docType}Error`, true);
            });
        } else {
            educationDocuments.style.display = 'none';
            educationFileUploads.innerHTML = '';
            uploadedFiles.educationDocs = {};
        }
    }

    function getRequiredEducationDocs(educationLevel) {
        const docsMap = {
            '10th': ['tenth_marks_memo'],
            'intermediate': ['tenth_certificate', 'intermediate_certificate'],
            'diploma': ['tenth_certificate', 'diploma_certificate'],
            'degree': ['tenth_certificate', 'diploma_certificate' ,'degree_certificate'],
            'btech': ['tenth_certificate', 'intermediate_certificate', 'btech_certificate'],
            'mtech': ['tenth_certificate', 'intermediate_certificate', 'btech_certificate', 'mtech_certificate'],
            'mca': ['tenth_certificate', 'intermediate_certificate', 'btech_certificate', 'mca_certificate'],
            'mba': ['tenth_certificate', 'intermediate_certificate', 'btech_certificate', 'mba_certificate'],
            'other': ['other_certificate']
        };
        return docsMap[educationLevel] || [];
    }

    function generateEducationFileUploads(educationLevel) {
        const docTypes = getRequiredEducationDocs(educationLevel);
        const labels = {
            'tenth_marks_memo': '10th Marks Memo',
            'tenth_certificate': '10th Certificate',
            'intermediate_certificate': 'Intermediate Certificate',
            'diploma_certificate': 'Diploma Certificate',
            'degree_certificate': 'degree_certificate',
            'btech_certificate': 'B.Tech Certificate',
            'mtech_certificate': 'M.Tech Certificate',
            'mca_certificate': 'MCA Certificate',
            'mba_certificate': 'MBA Certificate',
            'other_certificate': 'Relevant Certificate'
        };

        return docTypes.map(docType => `
            <div class="form-group">
                <label class="form-label">${labels[docType]} *</label>
                <input type="file" class="form-control" id="${docType}" accept="image/*,.pdf" required>
                <div class="error-message" id="${docType}Error"></div>
            </div>
        `).join('');
    }

    function handleExperienceLevelChange() {
        const value = this.value;
        const experienceDetails = document.getElementById('experienceDetails');

        if (value === 'experienced') {
            experienceDetails.style.display = 'block';
        } else {
            experienceDetails.style.display = 'none';
            // Clear experience fields
            document.getElementById('companyName').value = '';
            document.getElementById('companyContact').value = '';
            document.getElementById('experienceLetter').value = '';
            document.getElementById('paySlip').value = '';
            document.getElementById('offerLetter').value = '';
            uploadedFiles.experienceLetter = null;
            uploadedFiles.paySlip = null;
            uploadedFiles.offerLetter = null;
        }
    }

    function setupFileUpload(inputId, errorId, isEducationDoc = false) {
        const input = document.getElementById(inputId);
        if (!input) return;

        input.addEventListener('change', function () {
            const file = this.files[0];
            if (!file) return;

            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
            const maxSize = 5 * 1024 * 1024; // 5MB

            if (!allowedTypes.includes(file.type)) {
                document.getElementById(errorId).textContent = 'Only images and PDF files are allowed';
                document.getElementById(errorId).classList.add('show');
                this.value = '';
                return;
            }

            if (file.size > maxSize) {
                document.getElementById(errorId).textContent = 'File size too large. Maximum 5MB allowed';
                document.getElementById(errorId).classList.add('show');
                this.value = '';
                return;
            }

            document.getElementById(errorId).textContent = '';
            document.getElementById(errorId).classList.remove('show');

            // Upload file
            const formData = new FormData();
            formData.append('file', file);

            fetch('../../backend/api/upload.php', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        if (isEducationDoc) {
                            uploadedFiles.educationDocs[inputId] = data.file_path;
                        } else {
                            uploadedFiles[inputId] = data.file_path;
                        }
                        showAlert('File uploaded successfully', 'success');
                    } else {
                        showAlert(data.message || 'File upload failed', 'error');
                        this.value = '';
                    }
                })
                .catch(error => {
                    showAlert('Network error during file upload', 'error');
                    this.value = '';
                });
        });
    }

    function validateHigherEducation() {
        const value = document.getElementById('higherEducation').value;
        const error = document.getElementById('higherEducationError');
        const input = document.getElementById('higherEducation');

        if (!value) {
            error.textContent = 'Higher education is required';
            error.classList.add('show');
            input.classList.add('error');
            return false;
        }

        error.textContent = '';
        error.classList.remove('show');
        input.classList.remove('error');
        input.classList.add('success');
        return true;
    }

    function validateExperienceLevel() {
        const value = document.getElementById('experienceLevel').value;
        const error = document.getElementById('experienceLevelError');
        const input = document.getElementById('experienceLevel');

        if (!value) {
            error.textContent = 'Experience level is required';
            error.classList.add('show');
            input.classList.add('error');
            return false;
        }

        // If experienced, validate experience fields
        if (value === 'experienced') {
            const companyName = document.getElementById('companyName').value;
            const companyContact = document.getElementById('companyContact').value;

            if (!companyName) {
                error.textContent = 'Company name is required for experienced candidates';
                error.classList.add('show');
                input.classList.add('error');
                return false;
            }

            if (!companyContact) {
                error.textContent = 'Company contact is required for experienced candidates';
                error.classList.add('show');
                input.classList.add('error');
                return false;
            }

            if (!uploadedFiles.experienceLetter) {
                error.textContent = 'Experience letter is required for experienced candidates';
                error.classList.add('show');
                input.classList.add('error');
                return false;
            }

            if (!uploadedFiles.paySlip) {
                error.textContent = 'Pay slip is required for experienced candidates';
                error.classList.add('show');
                input.classList.add('error');
                return false;
            }

            if (!uploadedFiles.offerLetter) {
                error.textContent = 'Offer letter is required for experienced candidates';
                error.classList.add('show');
                input.classList.add('error');
                return false;
            }
        }

        error.textContent = '';
        error.classList.remove('show');
        input.classList.remove('error');
        input.classList.add('success');
        return true;
    }

    function validateRequiredText(value, errorId = null) {
        const errorElement = errorId ? document.getElementById(errorId) : null;
        const input = errorId ? document.getElementById(errorId.replace('Error', '')) : null;

        if (!value) {
            if (errorElement) {
                errorElement.textContent = 'This field is required';
                errorElement.classList.add('show');
            }
            if (input) input.classList.add('error');
            return false;
        }

        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
        if (input) {
            input.classList.remove('error');
            input.classList.add('success');
        }
        return true;
    }

    function validateConfirmPassword(value) {
        const error = document.getElementById('confirmPasswordError');
        const input = document.getElementById('confirmPassword');
        const passwordInput = document.getElementById('password');

        if (!value) {
            error.textContent = 'Confirm password is required';
            error.classList.add('show');
            input.classList.add('error');
            return false;
        }

        if (value !== passwordInput.value) {
            error.textContent = 'Passwords do not match';
            error.classList.add('show');
            input.classList.add('error');
            return false;
        }

        error.textContent = '';
        error.classList.remove('show');
        input.classList.remove('error');
        input.classList.add('success');
        return true;
    }

    function validateAge(value) {
        const error = document.getElementById('ageError');
        const input = document.getElementById('age');

        if (!value) {
            error.textContent = 'Age is required';
            error.classList.add('show');
            input.classList.add('error');
            return false;
        }

        const age = Number(value);
        if (!Number.isInteger(age) || age < 18 || age > 65) {
            error.textContent = 'Age must be between 18 and 65';
            error.classList.add('show');
            input.classList.add('error');
            return false;
        }

        error.textContent = '';
        error.classList.remove('show');
        input.classList.remove('error');
        input.classList.add('success');
        return true;
    }

    function validateGender(value) {
        const error = document.getElementById('genderError');
        const input = document.getElementById('gender');

        if (!value) {
            error.textContent = 'Gender is required';
            error.classList.add('show');
            input.classList.add('error');
            return false;
        }

        error.textContent = '';
        error.classList.remove('show');
        input.classList.remove('error');
        input.classList.add('success');
        return true;
    }

    function validateBloodGroup(value) {
        const error = document.getElementById('bloodGroupError');
        const input = document.getElementById('bloodGroup');

        if (!value) {
            error.textContent = 'Blood group is required';
            error.classList.add('show');
            input.classList.add('error');
            return false;
        }

        error.textContent = '';
        error.classList.remove('show');
        input.classList.remove('error');
        input.classList.add('success');
        return true;
    }

    function validateDepartment(value) {
        const error = document.getElementById('departmentError');
        const input = document.getElementById('department');

        if (!value) {
            error.textContent = 'Department is required';
            error.classList.add('show');
            input.classList.add('error');
            return false;
        }

        error.textContent = '';
        error.classList.remove('show');
        input.classList.remove('error');
        input.classList.add('success');
        return true;
    }

    function validateDesignation(value) {
        const error = document.getElementById('designationError');
        const input = document.getElementById('designation');

        if (!value) {
            error.textContent = 'Designation is required';
            error.classList.add('show');
            input.classList.add('error');
            return false;
        }

        error.textContent = '';
        error.classList.remove('show');
        input.classList.remove('error');
        input.classList.add('success');
        return true;
    }

    function validatePincode(value) {
        const error = document.getElementById('pincodeError');
        const input = document.getElementById('pincode');

        if (!value) {
            error.textContent = 'Pincode is required';
            error.classList.add('show');
            input.classList.add('error');
            return false;
        }

        if (!/^[0-9]{6}$/.test(value)) {
            error.textContent = 'Pincode must be 6 digits';
            error.classList.add('show');
            input.classList.add('error');
            return false;
        }

        error.textContent = '';
        error.classList.remove('show');
        input.classList.remove('error');
        input.classList.add('success');
        return true;
    }

    function validateEmail(value) {
        const error = document.getElementById('emailError');
        const input = document.getElementById('email');

        if (!value) {
            error.textContent = 'Email is required';
            error.classList.add('show');
            input.classList.add('error');
            return false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            error.textContent = 'Invalid email format';
            error.classList.add('show');
            input.classList.add('error');
            return false;
        }

        error.textContent = '';
        error.classList.remove('show');
        input.classList.remove('error');
        input.classList.add('success');
        return true;
    }

    function validatePhone(value) {
        const error = document.getElementById('phoneError');
        const input = document.getElementById('phone');

        if (!value) {
            error.textContent = 'Phone number is required';
            error.classList.add('show');
            input.classList.add('error');
            return false;
        }

        if (!/^[0-9]{10}$/.test(value)) {
            error.textContent = 'Phone number must be 10 digits';
            error.classList.add('show');
            input.classList.add('error');
            return false;
        }

        error.textContent = '';
        error.classList.remove('show');
        input.classList.remove('error');
        input.classList.add('success');
        return true;
    }

    function validatePassword(value) {
        const error = document.getElementById('passwordError');
        const input = document.getElementById('password');

        if (!value) {
            error.textContent = 'Password is required';
            error.classList.add('show');
            input.classList.add('error');
            return false;
        }

        if (value.length < 6) {
            error.textContent = 'Password must be at least 6 characters';
            error.classList.add('show');
            input.classList.add('error');
            return false;
        }

        error.textContent = '';
        error.classList.remove('show');
        input.classList.remove('error');
        input.classList.add('success');
        return true;
    }

    function validateDateOfBirth(value) {
        const error = document.getElementById('dateOfBirthError');
        const input = document.getElementById('dateOfBirth');

        if (!value) {
            error.textContent = 'Date of birth is required';
            error.classList.add('show');
            input.classList.add('error');
            return false;
        }

        const dob = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();

        if (age < 18 || age > 65) {
            error.textContent = 'Age must be between 18 and 65';
            error.classList.add('show');
            input.classList.add('error');
            return false;
        }

        error.textContent = '';
        error.classList.remove('show');
        input.classList.remove('error');
        input.classList.add('success');
        return true;
    }

    function showAlert(message, type) {
        const alertContainer = document.getElementById('alertContainer');
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} fade-in`;
        alert.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                ${type === 'success'
                ? '<polyline points="20 6 9 17 4 12"></polyline>'
                : type === 'warning'
                    ? '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>'
                    : '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>'
            }
            </svg>
            ${message}
        `;
        alertContainer.innerHTML = '';
        alertContainer.appendChild(alert);

        setTimeout(() => {
            alert.remove();
        }, 5000);
    }

    function setupRealTimeValidation(fieldId, validateFn, errorId) {
        const input = document.getElementById(fieldId);
        if (!input) return;
        input.addEventListener('input', () => validateFn(input.value));
        input.addEventListener('change', () => validateFn(input.value));
    }

    startCameraBtn.addEventListener('click', function () {
        startCamera();
    });
    retakePhotoBtn.addEventListener('click', function () {
        startCamera();
    });
    capturePhotoBtn.addEventListener('click', function () {
        capturePhoto();
    });
    window.addEventListener('beforeunload', function () {
        stopCamera();
    });

    async function startCamera() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            showAlert('Camera access is not supported by this browser. Please use a current browser over localhost or HTTPS.', 'error');
            return;
        }

        stopCamera();
        try {
            cameraStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
                audio: false
            });
            cameraPreview.srcObject = cameraStream;
            cameraPreview.style.display = 'block';
            photoPreview.style.display = 'none';
            startCameraBtn.style.display = 'none';
            retakePhotoBtn.style.display = 'none';
            capturePhotoBtn.disabled = false;
            cameraMessage.textContent = 'Position your face in the frame, then take your photo.';
        } catch (error) {
            cameraMessage.textContent = 'Camera permission is required to complete registration.';
            showAlert('Unable to access the camera. Please allow camera permission and try again.', 'error');
        }
    }

    function stopCamera() {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            cameraStream = null;
        }
        cameraPreview.srcObject = null;
        cameraPreview.style.display = 'none';
        capturePhotoBtn.disabled = true;
    }

    function capturePhoto() {
        if (!cameraStream || !cameraPreview.videoWidth) return;
        const canvas = document.createElement('canvas');
        canvas.width = cameraPreview.videoWidth;
        canvas.height = cameraPreview.videoHeight;
        canvas.getContext('2d').drawImage(cameraPreview, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(async (blob) => {
            if (!blob) {
                showAlert('Could not capture the photo. Please try again.', 'error');
                return;
            }
            photoPreview.src = URL.createObjectURL(blob);
            photoPreview.style.display = 'block';
            stopCamera();
            retakePhotoBtn.style.display = 'inline-flex';
            cameraMessage.textContent = 'Live photo captured. You can retake it before submitting.';
            await handlePhotoUpload(new File([blob], 'live-photo.jpg', { type: 'image/jpeg' }));
        }, 'image/jpeg', 0.9);
    }

    async function handlePhotoUpload(file) {
        // Camera captures are submitted as JPEG files.
        const allowedTypes = ['image/jpeg'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!allowedTypes.includes(file.type)) {
            showAlert('The camera photo could not be processed. Please retake it.', 'error');
            return;
        }

        if (file.size > maxSize) {
            showAlert('File size too large. Maximum 5MB allowed', 'error');
            return;
        }

        // Upload to server
        const formData = new FormData();
        formData.append('photo', file);

        try {
            const response = await fetch('../../backend/api/upload.php', {
                method: 'POST',
                body: formData
            });

            const responseText = await response.text();
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (error) {
                throw new Error(`Photo upload returned an invalid response (HTTP ${response.status}).`);
            }

            if (data.success) {
                uploadedPhoto = data.path;
                document.getElementById('photoError').textContent = '';
                document.getElementById('photoError').classList.remove('show');
                showAlert('Live photo captured successfully', 'success');
            } else {
                showAlert(data.message || 'Failed to upload photo', 'error');
            }
        } catch (error) {
            console.error('Live photo upload failed:', error);
            showAlert(error.message || 'Unable to upload the live photo. Please try again.', 'error');
        }
    }

    // Real-time validation
    const requiredField = errorId => value => validateRequiredText(value.trim(), errorId);
    const emergencyPhoneField = value => {
        const valid = /^[0-9]{10}$/.test(value);
        setError('emergencyContactNumberError', valid ? '' : (!value ? 'Emergency contact number is required' : 'Emergency contact number must be 10 digits'));
        return valid;
    };
    const fields = {
        firstName: { validate: requiredField('firstNameError'), error: 'firstNameError' },
        lastName: { validate: requiredField('lastNameError'), error: 'lastNameError' },
        email: { validate: validateEmail, error: 'emailError' },
        phone: { validate: validatePhone, error: 'phoneError' },
        password: { validate: validatePassword, error: 'passwordError' },
        confirmPassword: { validate: validateConfirmPassword, error: 'confirmPasswordError' },
        dateOfBirth: { validate: validateDateOfBirth, error: 'dateOfBirthError' },
        age: { validate: validateAge, error: 'ageError' },
        gender: { validate: validateGender, error: 'genderError' },
        bloodGroup: { validate: validateBloodGroup, error: 'bloodGroupError' },
        department: { validate: validateDepartment, error: 'departmentError' },
        designation: { validate: validateDesignation, error: 'designationError' },
        higherEducation: { validate: validateHigherEducation, error: 'higherEducationError' },
        experienceLevel: { validate: validateExperienceLevel, error: 'experienceLevelError' },
        emergencyContactName: { validate: requiredField('emergencyContactNameError'), error: 'emergencyContactNameError' },
        emergencyContactRelationship: { validate: requiredField('emergencyContactRelationshipError'), error: 'emergencyContactRelationshipError' },
        emergencyContactNumber: { validate: emergencyPhoneField, error: 'emergencyContactNumberError' },
        doorNumber: { validate: requiredField('doorNumberError'), error: 'doorNumberError' },
        street: { validate: requiredField('streetError'), error: 'streetError' },
        areaLocality: { validate: requiredField('areaLocalityError'), error: 'areaLocalityError' },
        city: { validate: requiredField('cityError'), error: 'cityError' },
        district: { validate: requiredField('districtError'), error: 'districtError' },
        state: { validate: requiredField('stateError'), error: 'stateError' },
        pincode: { validate: validatePincode, error: 'pincodeError' }
    };

    Object.keys(fields).forEach(fieldId => {
        const input = document.getElementById(fieldId);
        if (input) {
            input.addEventListener('input', () => fields[fieldId].validate(input.value));
            input.addEventListener('change', () => fields[fieldId].validate(input.value));
        }
    });

    // Setup event listeners for new fields
    const higherEducationSelect = document.getElementById('higherEducation');
    if (higherEducationSelect) {
        higherEducationSelect.addEventListener('change', handleHigherEducationChange);
    }

    const experienceLevelSelect = document.getElementById('experienceLevel');
    if (experienceLevelSelect) {
        experienceLevelSelect.addEventListener('change', handleExperienceLevelChange);
    }

    // Setup file uploads for required documents
    setupFileUpload('aadhaarFront', 'aadhaarFrontError');
    setupFileUpload('aadhaarBack', 'aadhaarBackError');
    setupFileUpload('panFront', 'panFrontError');
    setupFileUpload('experienceLetter', 'experienceLetterError');
    setupFileUpload('paySlip', 'paySlipError');
    setupFileUpload('offerLetter', 'offerLetterError');

    // Step navigation only advances after the visible step is valid.
    document.getElementById('nextStep1').addEventListener('click', () => {
        if (validateStep(1)) showStep(2);
        else showAlert('Please complete the required personal details.', 'error');
    });
    document.getElementById('nextStep2').addEventListener('click', () => {
        if (validateStep(2)) showStep(3);
        else showAlert('Please complete the required professional details.', 'error');
    });
    document.getElementById('prevStep2').addEventListener('click', () => showStep(1));
    document.getElementById('prevStep3').addEventListener('click', () => showStep(2));

    // Email OTP is generated and verified by the server; verification is reset whenever the email changes.
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('input', () => {
        emailVerified = false;
        document.getElementById('otpVerified').style.display = 'none';
        document.getElementById('emailVerifiedBadge').classList.remove('show');
        document.getElementById('otpInput').value = '';
    });
    document.getElementById('sendOtpBtn').addEventListener('click', async () => {
        if (!validateEmail(emailInput.value)) return;
        const button = document.getElementById('sendOtpBtn');
        button.disabled = true;
        try {
            const response = await fetch('../../backend/api/email_otp.php', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'send', email: emailInput.value.trim() })
            });
            const data = await response.json();
            if (!data.success) throw new Error(data.message || 'Unable to send OTP');
            document.getElementById('otpSection').style.display = 'block';
            document.getElementById('otpInput').focus();
            setError('otpError', '');
            const status = document.getElementById('otpStatus');
            let seconds = 60;
            status.style.display = 'block';
            const timer = setInterval(() => {
                status.textContent = seconds ? `OTP sent. You can request another code in ${seconds}s.` : 'You can request another OTP now.';
                if (seconds-- <= 0) clearInterval(timer);
            }, 1000);

            // Handle test mode - display OTP to user
            if (data.test_mode && data.otp) {
                status.textContent = `TEST MODE: Your OTP is ${data.otp} (SMTP not configured)`;
                showAlert(`TEST MODE: Your OTP is ${data.otp}`, 'warning');
            } else {
                status.textContent = `OTP sent. You can request another code in ${seconds}s.`;
                showAlert('OTP sent to your email address.', 'success');
            }
        } catch (error) {
            showAlert(error.message || 'Unable to send OTP. Please try again.', 'error');
        } finally { button.disabled = false; }
    });
    document.getElementById('verifyOtpBtn').addEventListener('click', async () => {
        const otp = document.getElementById('otpInput').value.trim();
        if (!/^\d{6}$/.test(otp)) { setError('otpError', 'Enter the 6-digit OTP.'); return; }
        try {
            const response = await fetch('../../backend/api/email_otp.php', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'verify', email: emailInput.value.trim(), otp })
            });
            const data = await response.json();
            if (!data.success) throw new Error(data.message || 'OTP verification failed');
            emailVerified = true;
            setError('otpError', '');
            document.getElementById('otpStatus').textContent = 'Email verified successfully. You may continue registration.';
            document.getElementById('otpVerified').style.display = 'block';
            document.getElementById('emailVerifiedBadge').classList.add('show');
            emailInput.readOnly = true;
            document.getElementById('sendOtpBtn').disabled = true;
            document.getElementById('otpInput').readOnly = true;
            document.getElementById('verifyOtpBtn').disabled = true;
            showAlert('Email verified successfully.', 'success');
        } catch (error) { setError('otpError', error.message); }
    });

    // Position-specific agreement: the original supplied PDF remains visible in the modal,
    // while this form creates the electronic acceptance record required by that agreement.
    const ndaModal = document.getElementById('ndaModal');
    const ndaPosition = document.getElementById('position');
    const ndaForm = document.getElementById('ndaAcceptanceForm');
    function openNdaModal(position) {
        const isEmployee = position === 'employee';
        const fullName = `${document.getElementById('firstName').value.trim()} ${document.getElementById('lastName').value.trim()}`.trim();
        document.getElementById('ndaModalTitle').textContent = isEmployee ? 'Employee Employment, Confidentiality, Intellectual Property & Data Security Agreement' : 'Online Unpaid Internship Terms, Confidentiality & Intellectual Property Agreement';
        document.getElementById('ndaFormHeading').textContent = isEmployee ? 'Employee electronic acceptance' : 'Intern electronic acceptance';
        document.getElementById('ndaDocument').src = isEmployee ? '../assets/documents/meta-minds-employee-agreement.pdf#toolbar=1' : '../assets/documents/meta-minds-intern-agreement.pdf#toolbar=1';
        document.getElementById('ndaFullName').value = fullName;
        document.getElementById('ndaEmail').value = emailInput.value.trim();
        document.getElementById('ndaMobile').value = document.getElementById('phone').value.trim();
        document.getElementById('ndaPosition').value = isEmployee ? 'Employee' : 'Intern';
        document.getElementById('ndaDepartment').value = document.getElementById('department').value;
        document.getElementById('ndaDesignation').value = document.getElementById('designation').value.trim();
        document.getElementById('ndaDateLabel').textContent = isEmployee ? 'Date of joining *' : 'Internship start date *';
        document.getElementById('ndaManagerLabel').textContent = isEmployee ? 'Reporting manager' : 'Reporting manager / mentor';
        document.getElementById('ndaTermsLabel').textContent = isEmployee ? 'I agree to the terms and conditions of the META MINDS PVT. LTD. Employee Agreement. *' : 'I agree to the terms and conditions of the META MINDS PVT. LTD. Unpaid Internship Agreement. *';
        const addressGroup = document.getElementById('ndaAddressGroup');
        document.getElementById('ndaCompanyAddress').required = isEmployee;
        addressGroup.style.display = isEmployee ? 'block' : 'none';
        document.getElementById('ndaModalError').textContent = '';
        ndaModal.classList.add('active');
    }
    ndaPosition.addEventListener('change', () => {
        ndaAcceptance = null;
        document.getElementById('ndaStatus').className = 'nda-status';
        document.getElementById('ndaStatus').textContent = ndaPosition.value ? 'Agreement acceptance is required before you can submit registration.' : 'No agreement accepted yet.';
        if (ndaPosition.value) openNdaModal(ndaPosition.value);
    });
    document.getElementById('cancelNdaBtn').addEventListener('click', () => {
        ndaModal.classList.remove('active');
        if (!ndaAcceptance) ndaPosition.value = '';
    });
    ndaForm.addEventListener('submit', event => {
        event.preventDefault();
        const typedName = document.getElementById('ndaTypedName').value.trim().replace(/\s+/g, ' ').toLowerCase();
        const expectedName = document.getElementById('ndaFullName').value.trim().replace(/\s+/g, ' ').toLowerCase();
        if (typedName !== expectedName) {
            document.getElementById('ndaModalError').textContent = 'Type your full legal name exactly as shown above.';
            document.getElementById('ndaModalError').classList.add('show');
            return;
        }
        const isEmployee = ndaPosition.value === 'employee';
        ndaAcceptance = {
            type: ndaPosition.value,
            version: isEmployee ? 'Employee Employment Agreement v1.0' : 'Unpaid Internship Agreement v1.0',
            agreement_id: `MM-${isEmployee ? 'EMP' : 'INT'}-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
            full_name: document.getElementById('ndaFullName').value,
            email: document.getElementById('ndaEmail').value,
            mobile: document.getElementById('ndaMobile').value,
            department: document.getElementById('ndaDepartment').value,
            designation: document.getElementById('ndaDesignation').value,
            start_date: document.getElementById('ndaStartDate').value,
            reporting_manager: document.getElementById('ndaManager').value.trim(),
            company_address: isEmployee ? document.getElementById('ndaCompanyAddress').value.trim() : '',
            accepted_at_client: new Date().toISOString()
        };
        ndaModal.classList.remove('active');
        const status = document.getElementById('ndaStatus');
        status.className = 'nda-status accepted';
        status.textContent = `${isEmployee ? 'Employee' : 'Intern'} agreement accepted. Agreement ID: ${ndaAcceptance.agreement_id}`;
        setError('ndaError', '');
        document.getElementById('password').focus();
    });

    // A signature can be uploaded or drawn. Both paths upload the final image to the server.
    const signatureCanvas = document.getElementById('signatureCanvas');
    const signatureContext = signatureCanvas.getContext('2d');
    signatureContext.lineWidth = 2;
    signatureContext.lineCap = 'round';
    function signaturePoint(event) {
        const rect = signatureCanvas.getBoundingClientRect();
        const point = event.touches ? event.touches[0] : event;
        return { x: (point.clientX - rect.left) * (signatureCanvas.width / rect.width), y: (point.clientY - rect.top) * (signatureCanvas.height / rect.height) };
    }
    function uploadSignature(file) {
        const data = new FormData(); data.append('file', file);
        return fetch('../../backend/api/upload.php', { method: 'POST', body: data })
            .then(response => response.json()).then(result => {
                if (!result.success) throw new Error(result.message || 'Signature upload failed');
                uploadedSignature = result.file_path;
                setError('signatureError', '');
                showAlert('Signature saved successfully.', 'success');
            });
    }
    document.getElementById('uploadSignatureBtn').addEventListener('click', () => document.getElementById('signatureUpload').click());
    document.getElementById('signatureUpload').addEventListener('change', event => {
        const file = event.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) { setError('signatureError', 'Choose an image smaller than 5MB.'); return; }
        uploadSignature(file).catch(error => setError('signatureError', error.message));
    });
    document.getElementById('drawSignatureBtn').addEventListener('click', () => {
        signatureCanvas.style.display = 'block';
        document.getElementById('clearSignatureBtn').style.display = 'inline-flex';
    });
    signatureCanvas.addEventListener('pointerdown', event => { signatureDrawing = true; signatureCanvas.setPointerCapture(event.pointerId); const p = signaturePoint(event); signatureContext.beginPath(); signatureContext.moveTo(p.x, p.y); });
    signatureCanvas.addEventListener('pointermove', event => { if (!signatureDrawing) return; const p = signaturePoint(event); signatureContext.lineTo(p.x, p.y); signatureContext.stroke(); signatureHasInk = true; });
    signatureCanvas.addEventListener('pointerup', () => { signatureDrawing = false; });
    document.getElementById('clearSignatureBtn').addEventListener('click', () => { signatureContext.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height); signatureHasInk = false; uploadedSignature = null; });
    signatureCanvas.addEventListener('pointerup', () => {
        if (!signatureHasInk) return;
        signatureCanvas.toBlob(blob => uploadSignature(new File([blob], 'signature.png', { type: 'image/png' })).catch(error => setError('signatureError', error.message)), 'image/png');
    });

    // Real-time validation for experience fields
    setupRealTimeValidation('companyName', validateRequiredText, 'companyNameError');
    setupRealTimeValidation('companyContact', validatePhone, 'companyContactError');

    registerForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        let isValid = true;
        const formData = {};

        Object.keys(fields).forEach(fieldId => {
            const input = document.getElementById(fieldId);
            if (input) {
                formData[fieldId] = input.value.trim();
                if (!fields[fieldId].validate(input.value)) {
                    isValid = false;
                }
            }
        });

        if (!uploadedPhoto) {
            document.getElementById('photoError').textContent = 'Photo is required';
            document.getElementById('photoError').classList.add('show');
            isValid = false;
        }
        if (!emailVerified) {
            setError('otpError', 'Verify your email address before submitting.');
            isValid = false;
        }
        if (!document.getElementById('position').value) {
            setError('positionError', 'Choose Employee or Intern.');
            isValid = false;
        }
        if (!uploadedSignature) {
            setError('signatureError', 'Upload or draw your signature.');
            isValid = false;
        }
        if (!ndaAcceptance || ndaAcceptance.type !== document.getElementById('position').value) {
            setError('ndaError', 'Open and accept the agreement for the selected position.');
            isValid = false;
        } else {
            setError('ndaError', '');
        }

        // Validate document uploads
        if (!uploadedFiles.aadhaarFront) {
            document.getElementById('aadhaarFrontError').textContent = 'Aadhaar front is required';
            document.getElementById('aadhaarFrontError').classList.add('show');
            isValid = false;
        }
        if (!uploadedFiles.aadhaarBack) {
            document.getElementById('aadhaarBackError').textContent = 'Aadhaar back is required';
            document.getElementById('aadhaarBackError').classList.add('show');
            isValid = false;
        }
        if (!uploadedFiles.panFront) {
            document.getElementById('panFrontError').textContent = 'PAN card front is required';
            document.getElementById('panFrontError').classList.add('show');
            isValid = false;
        }

        // Validate education documents based on selection
        const higherEducation = document.getElementById('higherEducation').value;
        if (higherEducation) {
            const requiredDocs = getRequiredEducationDocs(higherEducation);
            requiredDocs.forEach(docType => {
                if (!uploadedFiles.educationDocs[docType]) {
                    showAlert(`${docType} document is required`, 'error');
                    isValid = false;
                }
            });
        }

        // Validate experience documents if experienced
        const experienceLevel = document.getElementById('experienceLevel').value;
        if (experienceLevel === 'experienced') {
            if (!uploadedFiles.experienceLetter) {
                document.getElementById('experienceLetterError').textContent = 'Experience letter is required';
                document.getElementById('experienceLetterError').classList.add('show');
                isValid = false;
            }
            if (!uploadedFiles.paySlip) {
                document.getElementById('paySlipError').textContent = 'Pay slip is required';
                document.getElementById('paySlipError').classList.add('show');
                isValid = false;
            }
            if (!uploadedFiles.offerLetter) {
                document.getElementById('offerLetterError').textContent = 'Offer letter is required';
                document.getElementById('offerLetterError').classList.add('show');
                isValid = false;
            }
            if (!document.getElementById('companyName').value.trim()) {
                document.getElementById('companyNameError').textContent = 'Company name is required';
                document.getElementById('companyNameError').classList.add('show');
                isValid = false;
            }
            if (!document.getElementById('companyContact').value.trim()) {
                document.getElementById('companyContactError').textContent = 'Company contact is required';
                document.getElementById('companyContactError').classList.add('show');
                isValid = false;
            }
        }

        if (!isValid) {
            const firstError = [...document.querySelectorAll('.error-message.show')].find(error => error.textContent.trim());
            if (firstError) {
                const step = firstError.closest('.step-content');
                if (step) showStep(Number(step.id.replace('step', '')));
                const inputId = firstError.id.replace('Error', '');
                const input = document.getElementById(inputId);
                if (input) setTimeout(() => input.focus(), 350);
                Swal.fire({
                    icon: 'error',
                    title: 'Validation Error',
                    text: firstError.textContent.trim(),
                    confirmButtonColor: '#ef4444'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Validation Error',
                    text: 'Complete the required registration details before submitting.',
                    confirmButtonColor: '#ef4444'
                });
            }
            return;
        }

        btnText.style.display = 'none';
        btnSpinner.style.display = 'inline-block';

        // Show page loader safely
        const pageLoader = document.getElementById('pageLoader');
        if (pageLoader && pageLoader.classList) {
            pageLoader.classList.add('active');
        }

        try {
            const response = await fetch('../../backend/api/register.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    full_name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password,
                    confirm_password: formData.confirmPassword,
                    date_of_birth: document.getElementById('dateOfBirth').value,
                    age: formData.age,
                    gender: formData.gender,
                    blood_group: formData.bloodGroup,
                    aadhaar_number: document.getElementById('aadhaarNumber').value.trim(),
                    pan_number: document.getElementById('panNumber').value.trim(),
                    emergency_contact_name: formData.emergencyContactName,
                    emergency_contact_relationship: formData.emergencyContactRelationship,
                    emergency_contact_number: formData.emergencyContactNumber,
                    door_number: formData.doorNumber,
                    street: formData.street,
                    area_locality: formData.areaLocality,
                    city: formData.city,
                    district: formData.district,
                    state: formData.state,
                    pincode: formData.pincode,
                    department: formData.department,
                    designation: formData.designation,
                    higher_education: document.getElementById('higherEducation').value,
                    experience_level: document.getElementById('experienceLevel').value,
                    company_name: document.getElementById('companyName').value.trim(),
                    company_contact: document.getElementById('companyContact').value.trim(),
                    aadhaar_front: uploadedFiles.aadhaarFront,
                    aadhaar_back: uploadedFiles.aadhaarBack,
                    pan_front: uploadedFiles.panFront,
                    education_docs: uploadedFiles.educationDocs,
                    experience_letter: uploadedFiles.experienceLetter,
                    pay_slip: uploadedFiles.paySlip,
                    offer_letter: uploadedFiles.offerLetter,
                    photo: uploadedPhoto,
                    signature: uploadedSignature,
                    position: document.getElementById('position').value,
                    nda_accepted: true,
                    nda_record: ndaAcceptance
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Hide page loader
            if (pageLoader && pageLoader.classList) {
                pageLoader.classList.remove('active');
            }

            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Registration Submitted Successfully',
                    text: 'Your registration has been submitted and emails have been sent to both you and the admin. Please wait for admin approval.',
                    confirmButtonColor: '#667eea'
                }).then(() => {
                    window.location.href = 'login.php';
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Registration Failed',
                    text: data.message || 'Registration failed',
                    confirmButtonColor: '#ef4444'
                });
                if (data.errors) {
                    data.errors.forEach(error => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: error,
                            confirmButtonColor: '#ef4444'
                        });
                    });
                }
            }
        } catch (error) {
            console.error('Registration error:', error);
            if (pageLoader && pageLoader.classList) {
                pageLoader.classList.remove('active');
            }
            Swal.fire({
                icon: 'error',
                title: 'Network Error',
                text: 'Please try again. ' + error.message,
                confirmButtonColor: '#ef4444'
            });
        } finally {
            btnText.style.display = 'inline';
            btnSpinner.style.display = 'none';
        }
    });
});
