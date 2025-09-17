import React, { useState, useEffect } from "react";

// Helper component for form fields (Updated styling)
const FormField = ({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  disabled = false,
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-xs font-medium text-gray-600 mb-1"
    >
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      value={value || ""} 
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white disabled:bg-white disabled:cursor-not-allowed"
    />
  </div>
);

// Helper component for select/dropdown fields (Updated styling)
const SelectField = ({ label, id, value, onChange, disabled, children }) => (
  <div>
    <label
      htmlFor={id}
      className="block text-xs font-medium text-gray-600 mb-1"
    >
      {label}
    </label>
    <select
      id={id}
      name={id}
      value={value || ""}
      onChange={onChange}
      disabled={disabled}
      className="w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white disabled:bg-white disabled:cursor-not-allowed"
    >
      {children}
    </select>
  </div>
);

// Helper component for file uploads (no changes)
const FileUploadField = ({ label, id, className, url }) => (
    <div
        className={`flex flex-col items-center justify-center w-full h-20 p-2 border-2 border-gray-300 border-dashed rounded-md bg-gray-50 hover:bg-gray-100 transition-colors ${className}`}
    >
        {url ? (
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-center text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer">
                 <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                </svg>
                View {label}
            </a>
        ) : (
             <p className="text-center text-xs text-gray-400">No File</p>
        )}
    </div>
);


// Helper for a simple view button (no changes)
const ViewButton = () => (
  <div className="flex items-center justify-start h-full pt-5">
    <button
      type="button"
      className="w-full text-sm font-semibold text-[#4635FE] bg-white border border-[#4635FE] rounded-md px-4 py-1.5 hover:bg-indigo-50 transition-colors"
    >
      View
    </button>
  </div>
);

export default function App() {
    // In a real app, you might get this from the URL. We'll hardcode it for this example.
    const PARTNER_ID = 5;

    // State for all form fields, initialized to an empty object.
    const [formData, setFormData] = useState({});
    // State for the documents associated with the partner.
    const [documents, setDocuments] = useState([]);
    // State to track the approval/rejection status of each section.
    const [sectionStatuses, setSectionStatuses] = useState({});
    // Loading and error states for better UX.
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- 1. DATA FETCHING: This useEffect runs once when the component mounts ---
    useEffect(() => {
        const fetchPartnerData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`http://localhost:5000/api/partners/${PARTNER_ID}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                
                // --- Fully map all database fields to form state ---
                const mappedData = {
                    applicationReferenceId: data.application_reference_id,
                    applicationDate: data.application_date?.split('T')[0],
                    applicationRefBy: data.application_ref_by,
                    applicantClass: data.applicant_class,
                    firstName: data.first_name,
                    middleName: data.middle_name,
                    lastName: data.last_name,
                    dob: data.date_of_birth?.split('T')[0],
                    age: data.age,
                    gender: data.gender,
                    aadharNumber: data.aadhar_number,
                    panCardNumber: data.pan_card_number,
                    mobileNumber: data.mobile_number,
                    emailId: data.email_id,
                    maritalStatus: data.marital_status,
                    spouseName: data.spouse_name,
                    motherName: data.mother_name,
                    education: data.education,
                    occupation: data.occupation,
                    applicantPhotoUrl: data.applicant_photo_url,
                    currentAddress: data.current_address,
                    currentPincode: data.current_pincode,
                    currentState: data.current_state,
                    currentDistrict: data.current_district,
                    currentCity: data.current_city,
                    currentLocality: data.current_locality,
                    currentLandmark: data.current_landmark,
                    currentLatitude: data.current_latitude,
                    currentLongitude: data.current_longitude,
                    permanentAddress: data.permanent_address,
                    permanentPincode: data.permanent_pincode,
                    permanentState: data.permanent_state,
                    permanentDistrict: data.permanent_district,
                    permanentCity: data.permanent_city,
                    permanentLocality: data.permanent_locality,
                    permanentLandmark: data.permanent_landmark,
                    permanentLatitude: data.permanent_latitude,
                    permanentLongitude: data.permanent_longitude,
                    bankName: data.bank_name,
                    accountHolderName: data.account_holder_name,
                    bankAccountNumber: data.bank_account_number,
                    ifscCode: data.ifsc_code,
                    branchName: data.branch_name,
                    accountType: data.bank_account_type,
                    anyReason: data.final_decision_reason,
                    finalDecision: data.final_decision,
                    authSignature: data.authorized_person_signature_url,
                    digitalOTP: data.digital_otp,
                    ucCode: data.uc_code, 
                    lcCode: data.lc_code, 
                    authPersonName: data.authorized_person_name,
                    designation: data.authorized_person_designation,
                    employeeId: data.authorized_person_employee_id,
                    approvalDate: data.approval_date?.split('T')[0],
                };
                
                const kycDocs = data.documents || [];
                kycDocs.forEach(doc => {
                    if (doc.document_proof_type?.includes('PAN')) mappedData.kycPanNumber = doc.document_number;
                    if (doc.document_proof_type?.includes('Aadhar')) mappedData.kycAadharNumber = doc.document_number;
                    if (doc.document_proof_type?.includes('Address Proof')) mappedData.kycElecBillNumber = doc.document_number;
                    if (doc.document_proof_type?.includes('firm documents')) mappedData.kycShopActNumber = doc.document_number;
                });

                setFormData(mappedData);
                setDocuments(kycDocs);

                // --- Set initial section statuses from the fetched data ---
                setSectionStatuses({
                    applicant_details: data.applicant_details_status,
                    current_address: data.current_address_status,
                    permanent_address: data.permanent_address_status,
                    kyc_documents: data.kyc_documents_status,
                    banking_details: data.banking_details_status,
                });

            } catch (e) {
                console.error("Failed to fetch partner data:", e);
                setError("Could not load application data. Please ensure the backend server is running and reachable.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPartnerData();
    }, [PARTNER_ID]);

    // --- 2. API UPDATE: This function is called when an admin clicks Approved/Rejected ---
    const handleStatusChange = async (sectionKey, status) => {
        const currentStatus = sectionStatuses[sectionKey];
        const newStatus = currentStatus === status ? 'Pending' : status;

        setSectionStatuses(prev => ({ ...prev, [sectionKey]: newStatus }));
        
        try {
            // --- FIX: Replaced the unreliable prompt() with a default reason ---
            // In a real-world app, you would use a modal component to ask for a reason.
            const reason = newStatus === 'Rejected' 
                ? 'Rejected by admin' 
                : 'Approved by admin';

            const response = await fetch(`http://localhost:5000/api/partners/${PARTNER_ID}/section-status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    section: sectionKey,
                    status: newStatus,
                    reason: reason,
                }),
            });

            if (!response.ok) {
                throw new Error('API update failed');
            }
            
            console.log(`Section ${sectionKey} updated to ${newStatus}`);

        } catch (error) {
            console.error(`Failed to update status for ${sectionKey}:`, error);
            setSectionStatuses(prev => ({ ...prev, [sectionKey]: currentStatus }));
            alert("Failed to update status. Please check your connection and try again.");
        }
    };
    
    // Handles changes in the editable fields (sections 6 & 7)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    // Submits the final decision (section 6)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/partners/${PARTNER_ID}/decision`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    final_decision: formData.finalDecision,
                    final_decision_reason: formData.anyReason,
                }),
            });
    
            if (!response.ok) {
                throw new Error('API update for final decision failed');
            }
            
            const result = await response.json();
            console.log("Final decision updated successfully:", result);
            alert("Final decision has been updated successfully!");
    
        } catch (error) {
            console.error("Failed to update final decision:", error);
            alert("Failed to update final decision. Please check the console for errors.");
        }
    };
    
    // Helper component for Sections
    const Section = ({ title, children, sectionKey, onStatusChange }) => {
        const status = sectionStatuses[sectionKey];
        const approvedClasses = status === "Approved" ? "bg-green-100 text-green-800 border-green-300" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50";
        const rejectedClasses = status === "Rejected" ? "bg-red-100 text-red-800 border-red-300" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50";

        return (
            <section>
                <div className="flex justify-between items-center pb-2 mb-4 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-[#4635FE]">{title}</h2>
                    {onStatusChange && (
                        <div className="flex items-center space-x-2">
                            <button
                                type="button"
                                onClick={() => onStatusChange(sectionKey, "Approved")}
                                className={`px-4 py-1 text-xs font-semibold rounded-full border transition-colors duration-200 ${approvedClasses}`}
                            >
                                Approved
                            </button>
                            <button
                                type="button"
                                onClick={() => onStatusChange(sectionKey, "Rejected")}
                                className={`px-4 py-1 text-xs font-semibold rounded-full border transition-colors duration-200 ${rejectedClasses}`}
                            >
                                Rejected
                            </button>
                        </div>
                    )}
                </div>
                {children}
            </section>
        );
    };
    
    // --- RENDER LOGIC with loading and error states ---
    if (isLoading) {
        return <div className="flex justify-center items-center h-screen font-sans"><div>Loading Application Data...</div></div>;
    }
    if (error) {
        return <div className="flex justify-center items-center h-screen font-sans"><div className="text-red-600 bg-red-100 p-4 rounded-md shadow-md">{error}</div></div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
            <div className="max-w-7xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-md">
                <header className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-[#4635FE] mb-44">
                            Channel Partner Application Form
                        </h1>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4 mt-4">
                             <FormField label="Application Reference Id" id="applicationReferenceId" value={formData.applicationReferenceId} disabled />
                             <FormField label="Application Date" id="applicationDate" type="date" value={formData.applicationDate} disabled />
                             <FormField label="Application Ref By" id="applicationRefBy" value={formData.applicationRefBy} disabled />
                             <FormField label="Applicant Class" id="applicantClass" value={formData.applicantClass} disabled />
                        </div>
                    </div>
                     <div className="text-center ml-4 flex-shrink-0 mt-24">
                        <img
                            src={formData.applicantPhotoUrl || "https://placehold.co/100x100/E2E8F0/4A5568?text=Photo"}
                            alt={`${formData.firstName || 'user'} ${formData.lastName || 'name'}`}
                            className="rounded-md w-32 h-40 object-cover mx-auto border"
                        />
                        <p className="text-sm font-semibold mt-2">{`${formData.firstName || ''} ${formData.lastName || ''}`}</p>
                    </div>
                </header>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <Section
                        title="1. Applicant Details"
                        sectionKey="applicant_details"
                        onStatusChange={handleStatusChange}
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                            <div className="lg:col-span-1"><FormField label="First Name" id="firstName" value={formData.firstName} disabled /></div>
                            <div className="lg:col-span-1"><FormField label="Middle Name" id="middleName" value={formData.middleName} disabled /></div>
                            <div className="lg:col-span-1"><FormField label="Last Name" id="lastName" value={formData.lastName} disabled /></div>
                            <FormField label="Date of Birth" id="dob" type="date" value={formData.dob} disabled />
                            <FormField label="Age" id="age" value={formData.age} disabled />
                            <FormField label="Gender" id="gender" value={formData.gender} disabled />
                            <div className="lg:col-span-2"><FormField label="Aadhar Number" id="aadharNumber" value={formData.aadharNumber} disabled /></div>
                            <div className="lg:col-span-2"><FormField label="PAN Card Number" id="panCardNumber" value={formData.panCardNumber} disabled /></div>
                            <FormField label="Mobile Number" id="mobileNumber" value={formData.mobileNumber} disabled />
                            <FormField label="Email ID" id="emailId" type="email" value={formData.emailId} disabled />
                            <FormField label="Marital Status" id="maritalStatus" value={formData.maritalStatus} disabled />
                            <FormField label="Spouse Name" id="spouseName" value={formData.spouseName} disabled />
                            <FormField label="Mother Name" id="motherName" value={formData.motherName} disabled />
                            <FormField label="Education" id="education" value={formData.education} disabled />
                            <FormField label="Occupation" id="occupation" value={formData.occupation} disabled />
                        </div>
                    </Section>

                    <Section
                        title="2. Applicant Current Address"
                        sectionKey="current_address"
                        onStatusChange={handleStatusChange}
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                            <div className="lg:col-span-2"><FormField label="Current Address" id="currentAddress" value={formData.currentAddress} disabled /></div>
                            <FormField label="Pin Code" id="currentPincode" value={formData.currentPincode} disabled />
                            <FormField label="State" id="currentState" value={formData.currentState} disabled />
                            <FormField label="District" id="currentDistrict" value={formData.currentDistrict} disabled />
                            <FormField label="City" id="currentCity" value={formData.currentCity} disabled />
                            <FormField label="Locality/Village" id="currentLocality" value={formData.currentLocality} disabled />
                            <div className="lg:col-span-2"><FormField label="Near Landmark" id="currentLandmark" value={formData.currentLandmark} disabled /></div>
                            <FormField label="Latitude" id="currentLatitude" value={formData.currentLatitude} disabled />
                            <FormField label="Longitude" id="currentLongitude" value={formData.currentLongitude} disabled />
                        </div>
                    </Section>

                    <Section
                        title="3. Applicant Permanent Address"
                        sectionKey="permanent_address"
                        onStatusChange={handleStatusChange}
                    >
                         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                            <div className="lg:col-span-2"><FormField label="Permanent Address" id="permanentAddress" value={formData.permanentAddress} disabled /></div>
                            <FormField label="Pin Code" id="permanentPincode" value={formData.permanentPincode} disabled />
                            <FormField label="State" id="permanentState" value={formData.permanentState} disabled />
                            <FormField label="District" id="permanentDistrict" value={formData.permanentDistrict} disabled />
                            <FormField label="City" id="permanentCity" value={formData.permanentCity} disabled />
                            <FormField label="Locality/Village" id="permanentLocality" value={formData.permanentLocality} disabled />
                            <div className="lg:col-span-2"><FormField label="Near Landmark" id="permanentLandmark" value={formData.permanentLandmark} disabled /></div>
                            <FormField label="Latitude" id="permanentLatitude" value={formData.permanentLatitude} disabled />
                            <FormField label="Longitude" id="permanentLongitude" value={formData.permanentLongitude} disabled />
                        </div>
                    </Section>

                    <Section
                        title="4. Applicant KYC Documents"
                        sectionKey="kyc_documents"
                        onStatusChange={handleStatusChange}
                    >
                         <div className="space-y-2 border rounded-lg p-2">
                             <div className="grid grid-cols-5 gap-4 text-xs font-semibold text-gray-500 px-2 py-1">
                                 <span>Applicant KYC Proof Type</span>
                                 <span>Document Type</span>
                                 <span>Document Number</span>
                                 <span>Front Side</span>
                                 <span>Back Side</span>
                             </div>
                            <div className="grid grid-cols-5 gap-4 items-center bg-gray-50 p-2 rounded-md">
                                <div><p className="text-sm font-semibold">Applicant PAN Card</p></div>
                                <div><p className="text-sm">ID Proof</p></div>
                                <div><FormField id="kycPanNumber" value={formData.kycPanNumber} placeholder="PAN Number" disabled /></div>
                                <FileUploadField label="Front" id="panFront" url={documents.find(d => d.document_proof_type?.includes('PAN'))?.front_side_url} />
                                <FileUploadField label="Back" id="panBack" url={documents.find(d => d.document_proof_type?.includes('PAN'))?.back_side_url} />
                            </div>
                            <div className="grid grid-cols-5 gap-4 items-center bg-gray-50 p-2 rounded-md">
                                <div><p className="text-sm font-semibold">Applicant Aadhar Card</p></div>
                                <div><p className="text-sm">Address Card</p></div>
                                <div><FormField id="kycAadharNumber" value={formData.kycAadharNumber} placeholder="Aadhar Number" disabled /></div>
                                <FileUploadField label="Front" id="aadharFront" url={documents.find(d => d.document_proof_type?.includes('Aadhar'))?.front_side_url} />
                                <FileUploadField label="Back" id="aadharBack" url={documents.find(d => d.document_proof_type?.includes('Aadhar'))?.back_side_url} />
                            </div>
                        </div>
                        <div className="space-y-2 border rounded-lg p-2 mt-4">
                             <div className="grid grid-cols-5 gap-4 text-xs font-semibold text-gray-500 px-2 py-1">
                                <span>Applicant Address Proof</span>
                                <span>Document Type</span>
                                <span>Document Number</span>
                                <span>Front Side</span>
                                <span>Back Side</span>
                            </div>
                            <div className="grid grid-cols-5 gap-4 items-center bg-gray-50 p-2 rounded-md">
                                <div><p className="text-sm font-semibold">Applicant Address Proof</p></div>
                                <div><p className="text-sm">Electricity Bill</p></div>
                                <div><FormField id="kycElecBillNumber" value={formData.kycElecBillNumber} placeholder="Bill Number" disabled /></div>
                                <FileUploadField label="Front" id="elecBillFront" url={documents.find(d => d.document_proof_type?.includes('Address Proof'))?.front_side_url} />
                                <FileUploadField label="Back" id="elecBillBack" url={documents.find(d => d.document_proof_type?.includes('Address Proof'))?.back_side_url} />
                            </div>
                        </div>
                        <div className="space-y-2 border rounded-lg p-2 mt-4">
                             <div className="grid grid-cols-5 gap-4 text-xs font-semibold text-gray-500 px-2 py-1">
                                <span>Applicant have firm documents</span>
                                <span>Document Type</span>
                                <span>Document Number</span>
                                <span>Front Side</span>
                                <span>Back Side</span>
                            </div>
                            <div className="grid grid-cols-5 gap-4 items-center bg-gray-50 p-2 rounded-md">
                                <div><p className="text-sm font-semibold">Applicant firm documents</p></div>
                                <div><p className="text-sm">Shop Act</p></div>
                                <div><FormField id="kycShopActNumber" value={formData.kycShopActNumber} placeholder="Document Number" disabled /></div>
                                <FileUploadField label="Front" id="shopActFront" url={documents.find(d => d.document_proof_type?.includes('firm documents'))?.front_side_url} />
                                <FileUploadField label="Back" id="shopActBack" url={documents.find(d => d.document_proof_type?.includes('firm documents'))?.back_side_url} />
                            </div>
                        </div>
                    </Section>

                    <Section
                        title="5. Applicant Banking Details"
                        sectionKey="banking_details"
                        onStatusChange={handleStatusChange}
                    >
                         <div className="grid grid-cols-1 md:grid-cols-8 gap-4 items-center">
                            <FormField label="Bank Name" id="bankName" value={formData.bankName} disabled />
                            <FormField label="Account Holder Name" id="accountHolderName" value={formData.accountHolderName} disabled />
                            <div className="md:col-span-2"><FormField label="Bank Account Number" id="bankAccountNumber" value={formData.bankAccountNumber} disabled /></div>
                            <FormField label="IFSC Code" id="ifscCode" value={formData.ifscCode} disabled />
                            <FormField label="Branch Name" id="branchName" value={formData.branchName} disabled />
                            <FormField label="Type of Bank Account" id="accountType" value={formData.accountType} disabled />
                            <ViewButton />
                        </div>
                    </Section>

                    {/* UPDATED: Section 6 fields are now editable */}
                    <Section title="6. Final Authority Decision (Official Use Only)">
                         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            <SelectField label="Any Reason" id="anyReason" value={formData.anyReason} onChange={handleChange}>
                                <option value="">Enter Reason</option>
                                <option value="Incomplete Documents">Incomplete Documents</option>
                                <option value="Failed Verification">Failed Verification</option>
                                <option value="Other">Other</option>
                            </SelectField>
                            <SelectField label="Final Decision" id="finalDecision" value={formData.finalDecision} onChange={handleChange}>
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approved</option>
                                <option value="Rejected">Rejected</option>
                            </SelectField>
                            <SelectField label="Authorized Person Signature" id="authSignature" value={formData.authSignature} onChange={handleChange}>
                                 <option value="">Select Signature Type</option>
                                 <option value="digital">Digital Signature for Decision</option>
                                 <option value="manual">Manual Signature</option>
                            </SelectField>
                            <FormField label="Digital OTP" id="digitalOTP" value={formData.digitalOTP} placeholder="Enter Valid OTP" onChange={handleChange}/>
                         </div>
                         <div className="mt-6 flex justify-center">
                            <button
                                type="submit"
                                className="bg-[#4635FE] text-white font-semibold px-8 py-2.5 rounded-md hover:bg-indigo-700"
                            >
                                Update Decision
                            </button>
                         </div>
                    </Section>
                    
                    {/* UPDATED: Section 7 fields are now editable */}
                    <Section title="7. Authorized Person Details (Internal Use Only)">
                        <div className="grid grid-cols-1 md:grid-cols-8 gap-4 items-center">
                            <FormField label="UC Code" id="ucCode" value={formData.ucCode} onChange={handleChange} />
                            <FormField label="LC Code" id="lcCode" value={formData.lcCode} onChange={handleChange} />
                            <div className="md:col-span-2"><FormField label="Name of Authorized Approval Person" id="authPersonName" value={formData.authPersonName} onChange={handleChange} /></div>
                            <FormField label="Designation" id="designation" value={formData.designation} onChange={handleChange} />
                            <FormField label="Employee ID" id="employeeId" value={formData.employeeId} onChange={handleChange} />
                            <FormField label="Approval Date" id="approvalDate" type="date" value={formData.approvalDate} onChange={handleChange} />
                            <ViewButton />
                        </div>
                    </Section>
                </form>
            </div>
        </div>
    );
}


