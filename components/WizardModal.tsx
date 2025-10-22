"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, RefreshCw, Mic, StopCircle } from "lucide-react"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import ProgressOverlay from "@/components/progressBar"
import {
    SERVER_PUBLIC,
    categories, defaultCurrency,
    predefinedBuiltWith,
    predefinedFeatures,
    predefinedSuitableFor,
    predefinedTags, themeXYZStorage, helpDurationLabels
} from "@/lib/utils"
import toast from "react-hot-toast"
import SuccessSplash from "@/components/SuccessSplash";
import { useActiveCurrency } from "@/lib/currencyTag";
import { FeaturesCombobox } from "@/components/FeaturesCombobox"
import ProtocolInput from "@/components/ProtocolInput";

interface SellWizardModalProps {
    open: boolean
    onClose: () => void
    user: any
    sellType: string
}

interface ContactMethod {
    type: "WhatsApp" | "Email" | "Call"
    value: string
}

interface FormData {
    title: string
    isCategory: string
    featured: boolean
    priceNGN: number | ""
    priceUSD: number | ""
    demoUrl: string
    protocol: string
    adminProtocol: string
    downloadProtocol: string
    adminDemoUrl: string
    downloadUrl: string
    downloadInstructions: string
    loginDetails: LoginDetail[]
    helpDurationSettings: HelpDurationSetting[]
    preferredContact: ContactMethod[]
    tags: string[]
    features: string[]
    suitableFor: string[]
    compatibleBrowsers: string
    builtWith: string[]
    layout: "Responsive" | "Non-Responsive"
    // sellType: "UI/UX" | "Template" | "Complete Projects" | "Component"
    sellType: string
    license: string
    responseTime: string
    overview: string
    documentation: string
    uploadedImages: File[]
    galleryImages: string[]
    marketData: {
        rating: number
        reviews: number
        sales: number
    }
    isPublished: boolean
}

interface ValidationErrors {
    [key: string]: string
}

interface HelpDurationSetting {
    type: "author" | "extended"
    duration: string
    feeUSD: number | ""
    feeNGN: number | ""
}

interface LoginDetail {
    username: string
    password: string
    description: string
    urlType: "demo" | "admin"
}


// Step images that change for each step
export const stepImages: (string | null)[] = [
    "/step-illustrations/1.png",   // Step 1
    "/step-illustrations/2.png",   // Step 2
    "/step-illustrations/3.png",   // …
    "/step-illustrations/4.png",
    "/step-illustrations/5.png",
    "/step-illustrations/6.png",
    "/step-illustrations/7.png",
    "/step-illustrations/8.png",
    "/step-illustrations/9.png",
    "/step-illustrations/10.png",
    null
]

const licenseTypes = ["regular", "extended", "commercial"]

const helpDurations = ["1w", "1m", "2m", "3m", "4m", "6m", "1y"]


const contactMethods = ["WhatsApp", "Email", "Call"]

export default function SellWizardModal({ open, onClose, user }: SellWizardModalProps) {
    const initialFormData: FormData = {
        title: "",
        isCategory: "",
        featured: false,
        priceNGN: "",
        priceUSD: "",
        demoUrl: "",
        protocol: "https://",
        downloadProtocol: "https://",
        adminProtocol: "https://",
        adminDemoUrl: "",
        downloadUrl: "",
        downloadInstructions: "",
        loginDetails: [],
        marketData: {
            rating: 0,
            reviews: 0,
            sales: 0,
        },
        helpDurationSettings: [],
        preferredContact: [],
        tags: [],
        features: [],
        suitableFor: [],
        compatibleBrowsers: "All Major Browsers",
        builtWith: [],
        layout: "Responsive",
        sellType: "",
        license: "regular",
        responseTime: "24 hours",
        overview: "",
        documentation: "",
        uploadedImages: [],
        galleryImages: [],
    }

    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState<FormData>(initialFormData)
    const [showConfirmClose, setShowConfirmClose] = useState(false)
    const [errors, setErrors] = useState<ValidationErrors>({})

    const [newTag, setNewTag] = useState("")
    const [newFeature, setNewFeature] = useState("")
    const [newSuitableFor, setNewSuitableFor] = useState("")
    const [newBuiltWith, setNewBuiltWith] = useState("")
    const [newGalleryImage, setNewGalleryImage] = useState("")
    const [isProgressBar, setIsProgressBar] = useState({
        status: false,
        message: "Preparing your media files",
    })
    const [showSuccess, setShowSuccess] = useState(false)
    const [featureSearch, setFeatureSearch] = useState("")
    const [tagSearch, setTagSearch] = useState("")
    const [builtWithSearch, setBuiltWithSearch] = useState("")
    const [suitableForSearch, setSuitableForSearch] = useState("")

    const totalSteps = 11 // Updated from 8 to 9
    const { currency, symbol } = useActiveCurrency(defaultCurrency)
    const [showContactModal, setShowContactModal] = useState(false)
    const [showHelpDurationModal, setShowHelpDurationModal] = useState(false)
    const [showLoginModal, setShowLoginModal] = useState(false)
    const [currentContactMethod, setCurrentContactMethod] = useState("")
    const [currentContactValue, setCurrentContactValue] = useState("")
    const [currentHelpType, setCurrentHelpType] = useState<"author" | "extended">("author")
    const [tempHelpDuration, setTempHelpDuration] = useState("1w")
    const [tempHelpFeeUSD, setTempHelpFeeUSD] = useState<number | "">(0)
    const [tempHelpFeeNGN, setTempHelpFeeNGN] = useState<number | "">(0)
    const [tempLoginDetails, setTempLoginDetails] = useState({ username: "", password: "", description: "" })
    const [loginUrlType, setLoginUrlType] = useState<"demo" | "admin">("demo")

    //mic recording
    const [interimTranscript, setInterimTranscript] = useState("");
    const [recording, setRecording] = useState(false);
    const recognitionRef = useRef(null);

    const [interimTranscript2, setInterimTranscript2] = useState("");
    const [recording2, setRecording2] = useState(false);
    const recognitionRef2 = useRef(null);

    const [showSpeechHelp, setShowSpeechHelp] = useState(false);
    const [browserName, setBrowserName] = useState("");

    const getBrowserName = () => {
        const userAgent = navigator.userAgent;

        if (/chrome|crios|crmo/i.test(userAgent)) return "Chrome";
        if (/firefox|fxios/i.test(userAgent)) return "Firefox";
        if (/safari/i.test(userAgent) && !/chrome|crios|crmo/i.test(userAgent)) return "Safari";
        if (/edg/i.test(userAgent)) return "Edge";
        if (/opr\//i.test(userAgent)) return "Opera";
        return "Unknown";
    };

    //update when done
    const handleMicClick_2 = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Your browser does not support speech recognition.");
            return;
        }

        // Stop recording if already active
        if (recording) {
            recognitionRef.current?.stop();
            setRecording(false);
            return;
        }

        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        let lastTranscript = ""; // Prevent repeated appending

        recognition.onresult = (event) => {
            let finalTranscript = "";

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                const result = event.results[i];
                if (result.isFinal) {
                    finalTranscript += result[0].transcript;
                }
            }

            // Clean and append only if new
            finalTranscript = finalTranscript.trim();
            if (
                finalTranscript &&
                finalTranscript !== lastTranscript
            ) {
                lastTranscript = finalTranscript;

                // Add punctuation if missing
                if (!/[.!?]$/.test(finalTranscript)) {
                    finalTranscript += ".";
                }

                setFormData((prev) => ({
                    ...prev,
                    overview: prev.overview + " " + finalTranscript,
                }));
            }
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            setRecording(false);
        };

        recognition.onend = () => {
            setRecording(false);
        };

        recognition.start();
        setRecording(true);
    };

    //update in real-time
    const handleMicClick = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            // alert("Your browser does not support speech recognition.");
            const detected = getBrowserName();
            setBrowserName(detected);
            setShowSpeechHelp(true);

            return;
        }

        if (recording) {
            recognitionRef.current?.stop();
            setRecording(false);
            return;
        }

        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        let finalContent = ""; // Final transcript cache

        recognition.onresult = (event) => {
            let interim = "";
            let newlyFinal = "";

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                const result = event.results[i];
                const transcript = result[0].transcript;

                if (result.isFinal) {
                    newlyFinal += transcript;
                } else {
                    interim += transcript;
                }
            }

            // Update interim view
            setInterimTranscript(interim);

            // If new final content, add it to the formData
            if (newlyFinal) {
                finalContent += newlyFinal;

                let cleaned = newlyFinal.trim();
                if (!/[.!?]$/.test(cleaned)) {
                    cleaned += ".";
                }

                setFormData((prev) => ({
                    ...prev,
                    overview: prev.overview + " " + cleaned,
                }));
            }
        };

        recognition.onerror = (event) => {
            //console.log("Speech recognition error:", event.error);
            setRecording(false);
            setInterimTranscript("");
        };

        recognition.onend = () => {
            setRecording(false);
            setInterimTranscript("");
        };

        recognition.start();
        setRecording(true);
    };

    const handleMicClick2 = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            // alert("Your browser does not support speech recognition.");
            const detected = getBrowserName();
            setBrowserName(detected);
            setShowSpeechHelp(true);
            return;
        }

        if (recording) {
            recognitionRef2.current?.stop();
            setRecording2(false);
            return;
        }

        const recognition = new SpeechRecognition();
        recognitionRef2.current = recognition;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        let finalContent = ""; // Final transcript cache

        recognition.onresult = (event) => {
            let interim = "";
            let newlyFinal = "";

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                const result = event.results[i];
                const transcript = result[0].transcript;

                if (result.isFinal) {
                    newlyFinal += transcript;
                } else {
                    interim += transcript;
                }
            }

            // Update interim view
            setInterimTranscript2(interim);

            // If new final content, add it to the formData
            if (newlyFinal) {
                finalContent += newlyFinal;

                let cleaned = newlyFinal.trim();
                if (!/[.!?]$/.test(cleaned)) {
                    cleaned += ".";
                }

                setFormData((prev) => ({
                    ...prev,
                    downloadInstructions: prev.downloadInstructions + " " + cleaned,
                }));
            }
        };

        recognition.onerror = (event) => {
            //console.log("Speech recognition error:", event.error);
            setRecording2(false);
            setInterimTranscript2("");
        };

        recognition.onend = () => {
            setRecording2(false);
            setInterimTranscript2("");
        };

        recognition.start();
        setRecording2(true);
    };



    useEffect(() => {
        if (currentHelpType === "author") {
            setTempHelpFeeUSD(0)
            setTempHelpFeeNGN(0)
        }
    }, [currentHelpType])





    const formatPrice = (value: number | string): string => {
        if (!value) return ""
        const numValue = typeof value === "string" ? Number.parseFloat(value) : value
        return numValue.toLocaleString()
    }

    const parsePrice = (value: string): number => {
        return Number.parseFloat(value.replace(/,/g, "")) || 0
    }

    const addContactMethod = () => {
        let contactValue =
            currentContactMethod === "Email"
                ? user.email || currentContactValue.trim()
                : user.phone || currentContactValue.trim();

        if (currentContactMethod && contactValue) {
            const newContact: ContactMethod = {
                type: currentContactMethod as "WhatsApp" | "Email" | "Call",
                value: contactValue,
            };

            const existingIndex = formData.preferredContact.findIndex(
                (c) => c.type === currentContactMethod
            );

            if (existingIndex >= 0) {
                const updatedContacts = [...formData.preferredContact];
                updatedContacts[existingIndex] = newContact;
                handleChange("preferredContact", updatedContacts);
            } else {
                handleChange("preferredContact", [
                    ...formData.preferredContact,
                    newContact,
                ]);
            }
        }

        setCurrentContactMethod("");
        setCurrentContactValue("");
        setShowContactModal(false);
    };


    const removeContactMethod = (type: string) => {
        const newMethods = formData.preferredContact.filter((c) => c.type !== type)
        handleChange("preferredContact", newMethods)
    }

    const addHelpDuration = () => {
        // Check if user is trying to add extended without author
        if (currentHelpType === "extended" && !formData.helpDurationSettings.some((s) => s.type === "author")) {
            toast.error("Please add Author Help before adding Extended Help.")
            return
        }

        const newSetting: HelpDurationSetting = {
            type: currentHelpType,
            duration: tempHelpDuration,
            feeUSD: tempHelpFeeUSD,
            feeNGN: tempHelpFeeNGN,
        }

        // Remove existing setting of the same type
        const filteredSettings = formData.helpDurationSettings.filter((s) => s.type !== currentHelpType)

        handleChange("helpDurationSettings", [...filteredSettings, newSetting])

        // Reset temp values
        setTempHelpDuration("1w")
        setTempHelpFeeUSD(0)
        setTempHelpFeeNGN(0)
        setShowHelpDurationModal(false)
    }

    const removeHelpDuration = (type: "author" | "extended") => {
        const newSettings = formData.helpDurationSettings.filter((s) => s.type !== type)
        handleChange("helpDurationSettings", newSettings)
    }

    const addLoginDetail = () => {
        if (tempLoginDetails.username && tempLoginDetails.password) {
            const description = loginUrlType === "demo" ? "Demo Login" : "Admin Demo Login"
            handleChange("loginDetails", [
                ...formData.loginDetails,
                {
                    ...tempLoginDetails,
                    description,
                    urlType: loginUrlType,
                },
            ])
            setTempLoginDetails({ username: "", password: "", description: "" })
            setShowLoginModal(false)
        }
    }

    const removeLoginDetail = (index: number) => {
        const newDetails = formData.loginDetails.filter((_, i) => i !== index)
        handleChange("loginDetails", newDetails)
    }

    const domainWithPathRegex =
        /^(?!-)(?:[A-Za-z0-9-]{1,63}\.)+[A-Za-z]{2,}(?:\/.*)?$/;


    function validateStep(stepNumber: number, data: FormData): ValidationErrors {
        const errors: ValidationErrors = {};

        switch (stepNumber) {
            // STEP 1 – choose what to sell
            case 1:
                if (!data.sellType) errors.sellType = "Please choose what you want to sell";
                break;

            // STEP 2 – title + category
            case 2:
                if (!data.title.trim()) errors.title = "Product title is required";
                if (!data.isCategory) errors.isCategory = "Category is required";
                break;

            // STEP 3 – images
            case 3:
                if (data.uploadedImages.length === 0)
                    errors.uploadedImages = "At least one image is required";
                break;

            // STEP 4 – pricing
            case 4:
                if (!data.priceNGN || data.priceNGN <= 0)
                    errors.priceNGN = "NGN price must be greater than 0";
                if (!data.priceUSD || data.priceUSD <= 0)
                    errors.priceUSD = "USD price must be greater than 0";
                break;

            // STEP 5 – support / contact
            case 5:
                if (data.preferredContact.length === 0)
                    errors.preferredContact = "Add at least one contact method";
                if (data.helpDurationSettings.length === 0)
                    errors.helpDurationSettings = "Help-duration setting is required";
                break;

            // STEP 6 – demo URLs (only for “Complete Project”)
            case 6:

                if (data.sellType === "Complete Projects" || data.sellType === "Template") {
                    if (!data.demoUrl.trim()) {
                        errors.demoUrl = "Demo URL is required";
                    } else if (!domainWithPathRegex.test(data.demoUrl.trim())) {
                        errors.demoUrl = "Enter a valid domain (e.g., example.com)";
                    }

                    if (data.adminDemoUrl) {
                        if (!domainWithPathRegex.test(data.adminDemoUrl.trim())) {
                            errors.adminDemoUrl = "Enter a valid domain (e.g., admin.example.com)";
                        }
                    }
                }

                break;

            // STEP 7 – download links
            case 7:

                if (!data.downloadProtocol) {
                    errors.downloadProtocol = "Select a protocol (http:// or https://)";
                }

                if (!data.downloadUrl.trim()) {
                    errors.downloadUrl = "Download domain/path is required";
                } else if (!domainWithPathRegex.test(data.downloadUrl.trim())) {
                    errors.downloadUrl = "Enter a valid domain (e.g., example.com)";
                }

                if (!data.downloadInstructions.trim()) {
                    errors.downloadInstructions = "Download instructions are required";
                }

                break;

            // STEP 8 – features & tags
            case 8:
                if (data.features.length === 0)
                    errors.features = "Select at least one feature";
                if (data.tags.length === 0)
                    errors.tags = "Select at least one tag";
                break;

            // STEP 9 – built-with & suitable-for
            case 9:
                if (data.builtWith.length === 0)
                    errors.builtWith = "Select at least one technology";
                if (data.suitableFor.length === 0)
                    errors.suitableFor = "Select at least one target audience";
                break;

            // STEP 10 – overview
            case 10:
                if (!data.overview.trim())
                    errors.overview = "Product overview is required";
                break;

            default:
                break;
        }

        return errors;
    }


    const nextStep = () => {
        const errs = validateStep(step, formData);   // 1. run validation
        setErrors(errs);                             // 2. store any errors for UI

        if (Object.keys(errs).length === 0) {
            setStep((s) => Math.min(s + 1, totalSteps)); // 3. advance only when valid
        }
    };

    const prevStep = () => setStep((s) => Math.max(s - 1, 1))

    const handleChange = (field: keyof FormData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }))
        }
    }

    const addToArray = (field: keyof FormData, value: string, setValue: (val: string) => void) => {
        if (value.trim()) {
            const currentArray = formData[field] as string[]
            handleChange(field, [...currentArray, value.trim()])
            setValue("")
        }
    }

    const removeFromArray = (field: keyof FormData, index: number) => {
        const currentArray = formData[field] as string[]
        handleChange(
            field,
            currentArray.filter((_, i) => i !== index),
        )
    }

    //use for firebase
    const handleSubmit_firebase = async () => {
        const errs = validateStep(step, formData);
        setErrors(errs);

        if (Object.keys(errs).length !== 0) return;  // stop if invalid


        //console.log("Submitted formData:", formData)

        setIsProgressBar((p) => ({
            ...p,
            status: true,
            message: "Preparing your media files...",
        }))

        try {
            // 1️⃣ Build FormData for image upload
            const imageFormData = new FormData()
            formData.uploadedImages.forEach((file) => {
                imageFormData.append("images", file)
            })

            // 2️⃣ Upload images
            const imageRes = await fetch(`${SERVER_PUBLIC}/auth/author/product-image`, {
                method: "POST",
                body: imageFormData,
            })

            if (!imageRes.ok) throw new Error("Image upload failed")

            setIsProgressBar((p) => ({
                ...p,
                message: "Setting up your project...",
            }))

            const { urls } = await imageRes.json()
            //console.log("Uploaded image URLs:", urls)

            // 3️⃣ Update formData with galleryImages
            // const productData = {
            //     ...formData,
            //     galleryImages: urls,
            // }

            const productData = {
                ...formData,
                galleryImages: urls,
                demoUrl: formData.protocol + formData.demoUrl.trim(),
                downloadUrl: formData.downloadProtocol + formData.downloadUrl.trim(),
                adminDemoUrl: formData.adminDemoUrl
                    ? formData.adminProtocol + formData.adminDemoUrl.trim()
                    : "", // Only join if adminDemoUrl is provided
            };

            const token = localStorage.getItem("token")
            if (!token) {
                throw new Error("User is not authenticated")
            }

            // 4️⃣ Submit final product data
            const productRes = await fetch(`${SERVER_PUBLIC}/auth/author/product-upload`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                //add token
                body: JSON.stringify(productData),
            })

            if (!productRes.ok) throw new Error("Product upload failed")

            setIsProgressBar((p) => ({
                ...p,
                status: false,
                message: "",
            }))

            const productResult = await productRes.json()
            //console.log("Product saved:", productResult)

            handleClose()
        } catch (err) {
            console.error("Submit error:", err)

            setIsProgressBar((p) => ({
                ...p,
                status: false,
                message: "",
            }))
            // Optionally display error to user
        }
    }

    //use for cloudinary
    const handleSubmit_cloudinary = async () => {
        const errs = validateStep(step, formData);
        setErrors(errs);

        if (Object.keys(errs).length !== 0) return;  // stop if invalid

        //console.log("Submitted formData:", formData);

        setIsProgressBar((p) => ({
            ...p,
            status: true,
            message: "Preparing your media files...",
        }));

        try {
            // 1️⃣ Convert images to base64 array
            const base64Images = await Promise.all(
                formData.uploadedImages.map((file) => {
                    return new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = () => resolve(reader.result);
                        reader.onerror = (err) => reject(err);
                    });
                })
            );

            // 2️⃣ Upload images to Cloudinary
            const imageRes = await fetch(`${SERVER_PUBLIC}/auth/author/product-image-cloudinary`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ files: base64Images }),
            });

            if (!imageRes.ok) throw new Error("Image upload failed");

            setIsProgressBar((p) => ({
                ...p,
                message: "Setting up your project...",
            }));

            const { urls } = await imageRes.json();
            //console.log("Uploaded image URLs:", urls);

            // 3️⃣ Update formData with galleryImages
            // const productData = {
            //     ...formData,
            //     galleryImages: urls,
            // };

            const productData = {
                ...formData,
                galleryImages: urls,
                demoUrl: formData.protocol + formData.demoUrl.trim(),
                downloadUrl: formData.downloadProtocol + formData.downloadUrl.trim(),
                adminDemoUrl: formData.adminDemoUrl
                    ? formData.adminProtocol + formData.adminDemoUrl.trim()
                    : "", // Only join if adminDemoUrl is provided
            };

            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("User is not authenticated");
            }

            // 4️⃣ Submit final product data
            const productRes = await fetch(`${SERVER_PUBLIC}/auth/author/product-upload`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(productData),
            });

            if (!productRes.ok) throw new Error("Product upload failed");

            setIsProgressBar((p) => ({
                ...p,
                status: false,
                message: "",
            }));

            const productResult = await productRes.json();
            //console.log("Product saved:", productResult);

            setShowSuccess(true)

            handleClose();

        } catch (err) {
            console.error("Submit error:", err);

            setIsProgressBar((p) => ({
                ...p,
                status: false,
                message: "",
            }));
            // Optionally display error to user
        }
    };

    const handleSubmit = async () =>
        themeXYZStorage === 'cloudinary'
            ? await handleSubmit_cloudinary()
            : await handleSubmit_firebase();

    const handleClose = () => {
        // Clear all form data
        setFormData(initialFormData)
        setStep(1)
        setErrors({})
        setFeatureSearch("")
        setTagSearch("")
        setBuiltWithSearch("")
        setSuitableForSearch("")
        setShowConfirmClose(false)
        onClose()
    }

    const handleCloseClick = () => {
        setShowConfirmClose(true)
    }

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || [])
        if (files.length > 0) {
            const newImages = [...formData.uploadedImages, ...files].slice(0, 5) // Limit to 5 images
            handleChange("uploadedImages", newImages)
        }
    }

    const removeImage = (index: number) => {
        const newImages = formData.uploadedImages.filter((_, i) => i !== index)
        handleChange("uploadedImages", newImages)
    }

    const replaceImage = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const newImages = [...formData.uploadedImages]
            newImages[index] = file
            handleChange("uploadedImages", newImages)
        }
    }

    const renderStep = () => {
        switch (step) {

            /* STEP 1 – choose sell-type */
            case 1:
                return (
                    <div className="w-full max-w-md space-y-6">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold mb-2 text-gray-900">
                                What do you want to sell?
                            </h1>
                            <p className="text-gray-600">Pick the category that best fits your item.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { key: "UI/UX", label: "UI/UX / Design", desc: "Figma, XD or Sketch design files" },
                                { key: "Template", label: "Templates", desc: "HTML/CSS, Tailwind or Theme files" },
                                { key: "Complete Projects", label: "Complete Projects", desc: "Fully working application" },
                                { key: "Component", label: "Component", desc: "Isolated widgets or modules" },
                            ].map(card => (
                                <button
                                    key={card.key}
                                    onClick={() => handleChange("sellType", card.key as FormData["sellType"])}
                                    className={`border rounded-lg p-4 text-left hover:border-green-500
                        ${formData.sellType === card.key ? "ring-2 ring-green-500" : "border-gray-300"}`}
                                >
                                    <h3 className="font-semibold mb-1">{card.label}</h3>
                                    <p className="text-xs text-gray-500">{card.desc}</p>
                                </button>
                            ))}
                        </div>
                        {errors.sellType && <p className="text-red-500 text-xs mt-1">{errors.sellType}</p>}

                        <div className="flex justify-end pt-4">
                            <Button onClick={nextStep} className="bg-green-500 hover:bg-green-600 text-white px-6">
                                Continue
                            </Button>
                        </div>
                    </div>
                )

            case 2:
                return (
                    <div className="w-full max-w-full sm:max-w-md space-y-4 sm:space-y-6">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold mb-2 text-gray-900">Let's start with the basics</h1>
                            <p className="text-gray-600">Give your product a name and choose a category</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="title" className="text-sm text-gray-700">
                                    Product Name
                                </Label>
                                <p className="text-xs text-gray-500 mb-2">Choose a clear, descriptive name for your product</p>
                                <Input
                                    id="title"
                                    placeholder="Enter your product name"
                                    value={formData.title}
                                    onChange={(e) => handleChange("title", e.target.value)}
                                    className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                                />
                                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                            </div>

                            <div>
                                <Label htmlFor="category" className="text-sm text-gray-700">
                                    Category
                                </Label>
                                <p className="text-xs text-gray-500 mb-2">Select the category that best describes your product</p>
                                <Select value={formData.isCategory} onValueChange={(value) => handleChange("isCategory", value)}>
                                    <SelectTrigger className="bg-white border text-gray-900 focus:border-0 focus:ring-1 border-gray-300">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.isCategory && <p className="text-red-500 text-xs mt-1">{errors.isCategory}</p>}
                            </div>
                        </div>
                        {/* Navigation Buttons */}
                        <div className="flex justify-between pt-4 gap-2">
                            <Button
                                variant="ghost"
                                onClick={prevStep}
                                disabled={step === 1}
                                className="text-gray-600 bg-gray-100 hover:text-gray-900 disabled:opacity-50"
                            >
                                Back
                            </Button>
                            <Button onClick={nextStep} className="bg-green-500 hover:bg-green-600 text-white px-4 sm:px-8">
                                Continue
                            </Button>
                        </div>
                    </div>
                )

            case 3:
                return (
                    <div className="w-full max-w-full sm:max-w-md space-y-4 sm:space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold mb-2 text-gray-900">Add your images</h1>
                            <p className="text-gray-600">Upload up to 5 images. First image will be your cover.</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="image-upload" className="text-sm text-gray-700">
                                    Product Images ({formData.uploadedImages.length}/5)
                                </Label>
                                <p className="text-xs text-gray-500 mb-2">
                                    High-quality images help customers understand your product better
                                </p>
                                <div className="mt-2">
                                    <input
                                        id="image-upload"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleFileUpload}
                                        disabled={formData.uploadedImages.length >= 5}
                                        className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-500 file:text-white hover:file:bg-green-600 file:cursor-pointer cursor-pointer disabled:opacity-50"
                                    />
                                </div>
                                {errors.uploadedImages && <p className="text-red-500 text-xs mt-1">{errors.uploadedImages}</p>}
                            </div>

                            {formData.uploadedImages.length > 0 && (
                                <div className="space-y-4">
                                    {/* Cover Image */}
                                    <div>
                                        <Label className="text-sm text-gray-700">Cover Image</Label>
                                        <p className="text-xs text-gray-500 mb-2">This will be the main image customers see first</p>
                                        <div className="relative">
                                            <img
                                                src={
                                                    formData.uploadedImages[0]
                                                        ? URL.createObjectURL(formData.uploadedImages[0])
                                                        : "/placeholder.svg"
                                                }
                                                alt="Cover"
                                                className="w-full h-48 object-cover rounded-lg"
                                            />
                                            <div className="absolute top-2 right-2 flex gap-2">
                                                <label className="bg-green-600 text-white rounded-full p-2 hover:bg-green-600 cursor-pointer">
                                                    <input type="file" accept="image/*" onChange={(e) => replaceImage(0, e)} className="hidden" />
                                                    <RefreshCw className="h-3 w-3" />
                                                </label>
                                                <button
                                                    onClick={() => removeImage(0)}
                                                    className="bg-red-600 text-white rounded-full p-2 hover:bg-red-700"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional Images */}
                                    {formData.uploadedImages.length > 1 && (
                                        <div>
                                            <Label className="text-sm text-gray-700">Additional Images</Label>
                                            <p className="text-xs text-gray-500 mb-2">Show different views or features of your product</p>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                                {formData.uploadedImages.slice(1).map((image, index) => (
                                                    <div key={index + 1} className="relative">
                                                        <img
                                                            src={URL.createObjectURL(image) || "/placeholder.svg"}
                                                            alt={`Gallery ${index + 1}`}
                                                            className="w-full h-16 object-cover rounded"
                                                        />
                                                        <div className="absolute -top-1 -right-1 flex gap-1">
                                                            <label className="bg-green-600 text-white rounded-full p-1 cursor-pointer hover:bg-green-600">
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={(e) => replaceImage(index + 1, e)}
                                                                    className="hidden"
                                                                />
                                                                <RefreshCw className="h-2 w-2" />
                                                            </label>
                                                            <button
                                                                onClick={() => removeImage(index + 1)}
                                                                className="bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                                                            >
                                                                <X className="h-2 w-2" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between pt-4 gap-2">
                            <Button
                                variant="ghost"
                                onClick={prevStep}
                                disabled={step === 1}
                                className="text-gray-600 bg-gray-100 hover:text-gray-900 disabled:opacity-50"
                            >
                                Back
                            </Button>
                            <Button onClick={nextStep} className="bg-green-500 hover:bg-green-600 text-white px-4 sm:px-8">
                                Continue
                            </Button>
                        </div>
                    </div>
                )

            case 4:
                return (
                    <div className="w-full max-w-full sm:max-w-md space-y-4 sm:space-y-6">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold mb-2 text-gray-900">Set your pricing</h1>
                            <p className="text-gray-600">Add prices in both NGN and USD</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="priceNGN" className="text-sm text-gray-700">
                                    Price (NGN)
                                </Label>
                                <p className="text-xs text-gray-500 mb-2">Set your price in Nigerian Naira for local customers</p>
                                <Input
                                    id="priceNGN"
                                    type="text"
                                    inputMode="numeric" pattern="[0-9]*"
                                    placeholder="7,000"
                                    value={formData.priceNGN ? formatPrice(formData.priceNGN) : ""}
                                    onChange={(e) => {
                                        const numValue = parsePrice(e.target.value)
                                        handleChange("priceNGN", numValue || "")
                                    }}
                                    className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-0 focus:ring-1"
                                />
                                {errors.priceNGN && <p className="text-red-500 text-xs mt-1">{errors.priceNGN}</p>}
                            </div>

                            <div>
                                <Label htmlFor="priceUSD" className="text-sm text-gray-700">
                                    Price (USD)
                                </Label>
                                <p className="text-xs text-gray-500 mb-2">Set your price in US Dollars for international customers</p>
                                <Input
                                    id="priceUSD"
                                    type="text"
                                    inputMode="numeric" pattern="[0-9]*"
                                    placeholder="200"
                                    value={formData.priceUSD ? formatPrice(formData.priceUSD) : ""}
                                    onChange={(e) => {
                                        const numValue = parsePrice(e.target.value)
                                        handleChange("priceUSD", numValue || "")
                                    }}
                                    className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-0 focus:ring-1"
                                />
                                {errors.priceUSD && <p className="text-red-500 text-xs mt-1">{errors.priceUSD}</p>}
                            </div>
                        </div>
                        {/* Navigation Buttons */}
                        <div className="flex justify-between pt-4 gap-2">
                            <Button
                                variant="ghost"
                                onClick={prevStep}
                                disabled={step === 1}
                                className="text-gray-600 bg-gray-100 hover:text-gray-900 disabled:opacity-50"
                            >
                                Back
                            </Button>
                            <Button onClick={nextStep} className="bg-green-500 hover:bg-green-600 text-white px-4 sm:px-8">
                                Continue
                            </Button>
                        </div>
                    </div>
                )

            case 5:
                return (
                    <div className="w-full max-w-full sm:max-w-md space-y-4 sm:space-y-6">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold mb-2 text-gray-900">Support & Help</h1>
                            <p className="text-gray-600">Configure your support options</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <Label className="text-sm text-gray-700">Contact Methods</Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowContactModal(true)}
                                        className="text-green-600 border-green-600 hover:bg-green-50"
                                    >
                                        Add Contact Method
                                    </Button>
                                </div>
                                <p className="text-xs text-gray-500 mb-2">How customers can reach you for support</p>
                                {formData.preferredContact.length > 0 ? (
                                    <div className="space-y-2">
                                        {formData.preferredContact.map((contact, index) => (
                                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                                <div>
                                                    <span className="text-sm font-medium text-gray-700">{contact.type}: </span>
                                                    <span className="text-sm text-gray-600">{contact.value}</span>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeContactMethod(contact.type)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 italic">No contact methods added yet</p>
                                )}
                                {errors.preferredContact && <p className="text-red-500 text-xs mt-1">{errors.preferredContact}</p>}
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <Label className="text-sm text-gray-700">Help Duration Settings</Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowHelpDurationModal(true)}
                                        className="text-green-600 border-green-600 hover:bg-green-50"
                                    >
                                        Add Help Duration
                                    </Button>
                                </div>
                                <p className="text-xs text-gray-500 mb-2">
                                    Set how long you'll provide support and any fees for extended help
                                </p>
                                {formData.helpDurationSettings.length > 0 ? (
                                    <div className="space-y-2">
                                        {formData.helpDurationSettings.map((setting, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                                <div>
                                                    <div className="font-medium text-sm text-gray-900 capitalize">{setting.type} Help</div>
                                                    <div className="text-xs text-gray-600">
                                                        Duration: {helpDurationLabels[setting.duration]} | USD: {setting.feeUSD ? formatPrice(setting.feeUSD) : "Free"}{" "}
                                                        | NGN: {setting.feeNGN ? formatPrice(setting.feeNGN) : "Free"}
                                                    </div>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeHelpDuration(setting.type)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 italic">No help duration settings added yet</p>
                                )}
                                {errors.helpDurationSettings && (
                                    <p className="text-red-500 text-xs mt-1">{errors.helpDurationSettings}</p>
                                )}
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between pt-4 gap-2">
                            <Button
                                variant="ghost"
                                onClick={prevStep}
                                disabled={step === 1}
                                className="text-gray-600 bg-gray-100 hover:text-gray-900 disabled:opacity-50"
                            >
                                Back
                            </Button>
                            <Button onClick={nextStep} className="bg-green-500 hover:bg-green-600 text-white px-4 sm:px-8">
                                Continue
                            </Button>
                        </div>
                    </div>
                )

            case 6:
                if (formData.sellType !== "Complete Projects" && formData.sellType !== "Template") {
                    return (
                        <div className="w-full max-w-md text-center space-y-6">
                            <h1 className="text-3xl font-bold text-gray-900">No Demo Required</h1>
                            <p className="text-gray-600">
                                Demo links are only needed for full, running projects.
                            </p>
                            <div className="flex justify-between pt-4 gap-2">
                                <Button
                                    variant="ghost"
                                    onClick={prevStep}
                                    disabled={step === 1}
                                    className="text-gray-600 hover:text-gray-900 disabled:opacity-50"
                                >
                                    Back
                                </Button>
                                <Button onClick={nextStep} className="bg-green-500 hover:bg-green-600 text-white px-4 sm:px-8">
                                    Continue
                                </Button>
                            </div>
                        </div>
                    )
                }
                return (
                    <div className="w-full max-w-full sm:max-w-lg space-y-4 sm:space-y-6">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold mb-2 text-gray-900">Demo URLs</h1>
                            <p className="text-gray-600">Provide live demo links for your product</p>
                        </div>

                        <div className="max-h-80 overflow-y-auto space-y-4 pr-2 mx-4">
                            <div>
                                <Label htmlFor="demoUrl" className="text-sm text-gray-700">
                                    Demo URL *
                                </Label>
                                <p className="text-xs text-gray-500 mb-2">
                                    A working demo where customers can see your product in action
                                </p>

                                <ProtocolInput
                                    protocolValue={formData.protocol}
                                    inputValue={formData.demoUrl}
                                    onProtocolChange={(val) => handleChange("protocol", val)}
                                    onInputChange={(val) => handleChange("demoUrl", val)}
                                    inputPlaceholder="demo.example.com"
                                    id="demoUrl"
                                />


                                {errors.demoUrl && <p className="text-red-500 text-xs mt-1">{errors.demoUrl}</p>}

                                {/* Demo URL Login Details */}
                                <div className="mt-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <Label className="text-sm text-gray-700">Demo Login Details</Label>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setLoginUrlType("demo")
                                                setShowLoginModal(true)
                                            }}
                                            className="text-green-600 border-green-600 hover:bg-green-50"
                                        >
                                            Add Test Credential
                                        </Button>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-2">
                                        If your demo requires login, provide test credentials here
                                    </p>
                                    {formData.loginDetails.filter((detail) => detail.urlType === "demo").length > 0 ? (
                                        <div className="space-y-2">
                                            {formData.loginDetails
                                                .filter((detail) => detail.urlType === "demo")
                                                .map((detail, index) => (
                                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                                        <div>
                                                            <div className="font-medium text-sm text-gray-900">{detail.description}</div>
                                                            <div className="text-xs text-gray-600">
                                                                Username: {detail.username} | Password: {detail.password}
                                                            </div>
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                const allLoginDetails = formData.loginDetails
                                                                const demoLoginIndex = allLoginDetails.findIndex(
                                                                    (d) => d.urlType === "demo" && d.username === detail.username,
                                                                )
                                                                if (demoLoginIndex >= 0) {
                                                                    removeLoginDetail(demoLoginIndex)
                                                                }
                                                            }}
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500 italic">No login details added yet</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="adminDemoUrl" className="text-sm text-gray-700">
                                    Admin Demo URL (Optional)
                                </Label>
                                <p className="text-xs text-gray-500 mb-2">
                                    If your product has an admin panel, provide a demo link here
                                </p>

                                <ProtocolInput
                                    protocolValue={formData.adminProtocol}
                                    inputValue={formData.adminDemoUrl}
                                    onProtocolChange={(val) => handleChange("adminProtocol", val)}
                                    onInputChange={(val) => handleChange("adminDemoUrl", val)}
                                    inputPlaceholder="admin.demo.example.com"
                                    id="adminDemoUrl"
                                />


                                {errors.adminDemoUrl && <p className="text-red-500 text-xs mt-1">{errors.adminDemoUrl}</p>}

                                {/* Admin Demo URL Login Details */}
                                <div className="mt-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <Label className="text-sm text-gray-700">Admin Login Details</Label>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setLoginUrlType("admin")
                                                setShowLoginModal(true)
                                            }}
                                            className="text-green-600 border-green-600 hover:bg-green-50"
                                        >
                                            Add Test Credential
                                        </Button>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-2">
                                        Provide admin credentials for customers to test admin features
                                    </p>
                                    {formData.loginDetails.filter((detail) => detail.urlType === "admin").length > 0 ? (
                                        <div className="space-y-2">
                                            {formData.loginDetails
                                                .filter((detail) => detail.urlType === "admin")
                                                .map((detail, index) => (
                                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                                        <div>
                                                            <div className="font-medium text-sm text-gray-900">{detail.description}</div>
                                                            <div className="text-xs text-gray-600">
                                                                Username: {detail.username} | Password: {detail.password}
                                                            </div>
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                const allLoginDetails = formData.loginDetails
                                                                const adminLoginIndex = allLoginDetails.findIndex(
                                                                    (d) => d.urlType === "admin" && d.username === detail.username,
                                                                )
                                                                if (adminLoginIndex >= 0) {
                                                                    removeLoginDetail(adminLoginIndex)
                                                                }
                                                            }}
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500 italic">No login details added yet</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between pt-4 gap-2">
                            <Button
                                variant="ghost"
                                onClick={prevStep}
                                disabled={step === 1}
                                className="text-gray-600 bg-gray-100 hover:text-gray-900 disabled:opacity-50"
                            >
                                Back
                            </Button>
                            <Button onClick={nextStep} className="bg-green-500 hover:bg-green-600 text-white px-4 sm:px-8">
                                Continue
                            </Button>
                        </div>
                    </div>
                )

            case 7:
                return (
                    <div className="w-full max-w-full sm:max-w-md space-y-4 sm:space-y-6">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold mb-2 text-gray-900">Download Links</h1>
                            <p className="text-gray-600">Provide download information for your product</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="downloadUrl" className="text-sm text-gray-700">
                                    Download URL *
                                </Label>
                                <p className="text-xs text-gray-500 mb-2">
                                    Direct link where customers can download your product after purchase
                                </p>

                                <ProtocolInput
                                    protocolValue={formData.downloadProtocol}
                                    inputValue={formData.downloadUrl}
                                    onProtocolChange={(val) => handleChange("downloadProtocol", val)}
                                    onInputChange={(val) => handleChange("downloadUrl", val)}
                                    inputPlaceholder="download.example.com"
                                    id="downloadUrl"
                                />

                                {errors.downloadUrl && <p className="text-red-500 text-xs mt-1">{errors.downloadUrl}</p>}
                            </div>

                            <div>
                                <Label htmlFor="downloadInstructions" className="text-sm text-gray-700">
                                    Download Instructions *
                                </Label>
                                <p className="text-xs text-gray-500 mb-2">
                                    Step-by-step instructions on how to download, install, and set up your product
                                </p>
                                {/* <Textarea
                                    id="downloadInstructions"
                                    placeholder="1. Click the download link&#10;2. Extract the files&#10;3. Follow the setup guide..."
                                    value={formData.downloadInstructions}
                                    onChange={(e) => handleChange("downloadInstructions", e.target.value)}
                                    className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 min-h-[120px]"
                                /> */}

                                {/* Wrapper for positioning */}
                                <div className="relative">
                                    {/* <Textarea
                                    id="downloadInstructions"
                                    placeholder="Describe your product, its key benefits, unique features, and what problems it solves..."
                                    value={formData.downloadInstructions}
                                    onChange={(e) => handleChange("downloadInstructions", e.target.value)}
                                    className="bg-white border border-gray-300 text-gray-900 placeholder-gray-500 min-h-[120px] focus:border-green-500 focus:ring-1 focus:ring-green-500 pr-10" // extra padding for icon
                                /> */}

                                    <textarea
                                        id="downloadInstructions"
                                        rows={5}
                                        value={`${formData.downloadInstructions}${interimTranscript2 ? ' ' + interimTranscript2 : ''}`}
                                        onChange={(e) => handleChange("downloadInstructions", e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="Describe your product..."
                                    ></textarea>


                                    {/* Mic icon button */}
                                    <button
                                        type="button"
                                        onClick={handleMicClick2} // You can define this function
                                        className="absolute bottom-2 right-2 bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100 focus:outline-none"
                                        title="Record voice"
                                    >

                                        {/* Recording indicator */}
                                        {recording2 && (
                                            <div className="absolute bottom-0 right-10 flex items-center space-x-1 animate-pulse text-red-600 text-xs">
                                                <span className="w-2 h-2 bg-red-600 rounded-full" />
                                                <span>Recording…</span>
                                            </div>
                                        )}

                                        {
                                            !recording2 ? <Mic className="h-4 w-4 text-gray-600" /> : <StopCircle className="h-4 w-4 text-red-600" />
                                        }
                                    </button>
                                </div>


                                {errors.downloadInstructions && (
                                    <p className="text-red-500 text-xs mt-1">{errors.downloadInstructions}</p>
                                )}
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between pt-4 gap-2">
                            <Button
                                variant="ghost"
                                onClick={prevStep}
                                disabled={step === 1}
                                className="text-gray-600 bg-gray-100 hover:text-gray-900 disabled:opacity-50"
                            >
                                Back
                            </Button>
                            <Button onClick={nextStep} className="bg-green-500 hover:bg-green-600 text-white px-4 sm:px-8">
                                Continue
                            </Button>
                        </div>
                    </div>
                )

            case 8:
                return (
                    <div className="w-full max-w-full sm:max-w-md space-y-4 sm:space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold mb-2 text-gray-900">Features & Tags</h1>
                            <p className="text-gray-600">Select features and tags for your product</p>
                        </div>

                        <div className="space-y-4">
                            {/* Features */}

                            {/* <div>
                                <Label className="text-sm text-gray-700">Features</Label>
                                <p className="text-xs text-gray-500 mb-2">
                                    Highlight the key features and capabilities of your product
                                </p>
                                <div className="relative">
                                    <Select
                                        onValueChange={(value) => {
                                            if (!formData.features.includes(value)) {
                                                handleChange("features", [...formData.features, value])
                                            }
                                        }}
                                    >
                                        <SelectTrigger className="bg-white border border-gray-300 text-gray-900 focus:border-green-500 focus:ring-1 focus:ring-green-500">
                                            <SelectValue placeholder="Search and select features..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <div className="sticky top-0 p-2 bg-white border-b">
                                                <Input
                                                    placeholder="Search features..."
                                                    value={featureSearch}
                                                    onChange={(e) => setFeatureSearch(e.target.value)}
                                                    className="bg-white border border-gray-300 text-gray-900 placeholder-gray-500 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500"
                                                />
                                            </div>
                                            <div className="max-h-48 overflow-y-auto">
                                                {predefinedFeatures
                                                    .filter((feature) => feature.toLowerCase().includes(featureSearch.toLowerCase()))
                                                    .map((feature) => {
                                                        const isSelected = formData.features.includes(feature)
                                                        return (
                                                            <SelectItem
                                                                key={feature}
                                                                value={feature}
                                                                className={isSelected ? "bg-green-100 text-green-800" : ""}
                                                            >
                                                                <div className="flex items-center justify-between w-full">
                                                                    <span>{feature}</span>
                                                                    {isSelected && <span className="text-green-600 text-xs">✓ Selected</span>}
                                                                </div>
                                                            </SelectItem>
                                                        )
                                                    })}
                                            </div>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {formData.features.map((feature, index) => (
                                        <Badge key={index} variant="secondary" className="bg-gray-200 text-gray-800">
                                            {feature}
                                            <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => removeFromArray("features", index)} />
                                        </Badge>
                                    ))}
                                </div>
                                {errors.features && <p className="text-red-500 text-xs mt-1">{errors.features}</p>}
                            </div> */}


                            {/* <div>
                                <Label className="text-sm text-gray-700">Features</Label>
                                <p className="text-xs text-gray-500 mb-2">
                                    Highlight the key features and capabilities of your product
                                </p>

                                <div className="relative">
                                    <Select
                                        onValueChange={(value) => {
                                            // Handle "create new" sentinel
                                            if (value.startsWith("__create__:")) {
                                                const newFeature = value.replace("__create__:", "").trim()
                                                if (newFeature && !formData.features.includes(newFeature)) {
                                                    handleChange("features", [...formData.features, newFeature])
                                                }
                                                // optional: clear the search after adding
                                                setFeatureSearch("")
                                                return
                                            }

                                            // Handle normal selection
                                            if (!formData.features.includes(value)) {
                                                handleChange("features", [...formData.features, value])
                                            }
                                        }}
                                    >
                                        <SelectTrigger className="bg-white border border-gray-300 text-gray-900 focus:border-green-500 focus:ring-1 focus:ring-green-500">
                                            <SelectValue placeholder="Search and select features..." />
                                        </SelectTrigger>

                                        <SelectContent>
                                          
                                            <div className="sticky top-0 p-2 bg-white border-b">
                                                <Input
                                                    placeholder="Search or type a new feature..."
                                                    value={featureSearch}
                                                    onChange={(e) => setFeatureSearch(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            e.preventDefault()
                                                            const term = featureSearch.trim()
                                                            if (
                                                                term &&
                                                                !formData.features.includes(term) &&
                                                                !predefinedFeatures.some(f => f.toLowerCase() === term.toLowerCase())
                                                            ) {
                                                                handleChange("features", [...formData.features, term])
                                                                setFeatureSearch("")
                                                            }
                                                        }
                                                    }}
                                                    className="bg-white border border-gray-300 text-gray-900 placeholder-gray-500 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500"
                                                />
                                            </div>

                                            <div className="max-h-48 overflow-y-auto">
                                                {featureSearch.trim() &&
                                                    !predefinedFeatures.some(f => f.toLowerCase().includes(featureSearch.toLowerCase())) &&
                                                    !formData.features.some(f => f.toLowerCase() === featureSearch.toLowerCase()) && (
                                                        <SelectItem
                                                            value={`__create__:${featureSearch.trim()}`}
                                                            className="text-green-700"
                                                        >
                                                            ➕ Add “{featureSearch.trim()}”
                                                        </SelectItem>
                                                    )
                                                }

                                                {predefinedFeatures
                                                    .filter((feature) =>
                                                        feature.toLowerCase().includes(featureSearch.toLowerCase())
                                                    )
                                                    .map((feature) => {
                                                        const isSelected = formData.features.includes(feature)
                                                        return (
                                                            <SelectItem
                                                                key={feature}
                                                                value={feature}
                                                                className={isSelected ? "bg-green-100 text-green-800" : ""}
                                                            >
                                                                <div className="flex items-center justify-between w-full">
                                                                    <span>{feature}</span>
                                                                    {isSelected && (
                                                                        <span className="text-green-600 text-xs">✓ Selected</span>
                                                                    )}
                                                                </div>
                                                            </SelectItem>
                                                        )
                                                    })}
                                            </div>
                                        </SelectContent>
                                    </Select>
                                </div>

                        
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {formData.features.map((feature, index) => (
                                        <Badge key={index} variant="secondary" className="bg-gray-200 text-gray-800">
                                            {feature}
                                            <X
                                                className="h-3 w-3 ml-1 cursor-pointer"
                                                onClick={() => removeFromArray("features", index)}
                                            />
                                        </Badge>
                                    ))}
                                </div>

                                {errors.features && (
                                    <p className="text-red-500 text-xs mt-1">{errors.features}</p>
                                )}
                            </div> */}


                            <FeaturesCombobox
                                predefinedFeatures={predefinedFeatures}
                                value={formData.features}
                                onChange={(next) => handleChange("features", next)}
                                label="Features"
                                placeholder="Type to add or pick…"
                                subtext="Highlight the key features and capabilities of your product"
                                errors={errors.features}

                            />



                            {/* Tags */}
                            <div>

                                <FeaturesCombobox
                                    predefinedFeatures={predefinedTags}
                                    value={formData.tags}
                                    onChange={(next) => handleChange("tags", next)}
                                    label="Tags"
                                    placeholder="Type to add or pick…"
                                    subtext="Add relevant tags to help customers find your product in searches"
                                    errors={errors.tags}

                                />

                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between pt-4 gap-2">
                            <Button
                                variant="ghost"
                                onClick={prevStep}
                                disabled={step === 1}
                                className="text-gray-600 bg-gray-100 hover:text-gray-900 disabled:opacity-50"
                            >
                                Back
                            </Button>
                            <Button onClick={nextStep} className="bg-green-500 hover:bg-green-600 text-white px-4 sm:px-8">
                                Continue
                            </Button>
                        </div>
                    </div>
                )

            case 9:
                return (
                    <div className="w-full max-w-full sm:max-w-md space-y-4 sm:space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold mb-2 text-gray-900">Additional Details</h1>
                            <p className="text-gray-600">Add technical details and suitable audience</p>
                        </div>

                        <div className="space-y-4">
                            {/* Built With */}
                            <div>

                                <FeaturesCombobox
                                    predefinedFeatures={predefinedBuiltWith}
                                    value={formData.builtWith}
                                    onChange={(next) => handleChange("builtWith", next)}
                                    label="Built With"
                                    placeholder="Type to add or pick…"
                                    subtext="Select the technologies and frameworks used to build your product"
                                    errors={errors.builtWith}

                                />

                            </div>

                            {/* Suitable For */}
                            <div>

                                <FeaturesCombobox
                                    predefinedFeatures={predefinedSuitableFor}
                                    value={formData.suitableFor}
                                    onChange={(next) => handleChange("suitableFor", next)}
                                    label="Suitable For"
                                    placeholder="Type to add or pick…"
                                    subtext="Who is your target audience? Select the types of users or businesses this product is best for"
                                    errors={errors.suitableFor}

                                />

                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between pt-4 gap-2">
                            <Button
                                variant="ghost"
                                onClick={prevStep}
                                disabled={step === 1}
                                className="text-gray-600 bg-gray-100 hover:text-gray-900 disabled:opacity-50"
                            >
                                Back
                            </Button>
                            <Button onClick={nextStep} className="bg-green-500 hover:bg-green-600 text-white px-4 sm:px-8">
                                Continue
                            </Button>
                        </div>
                    </div>
                )

            case 10:
                return (
                    <div className="w-full max-w-full sm:max-w-md space-y-4 sm:space-y-6">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold mb-2 text-gray-900">Final Settings</h1>
                            <p className="text-gray-600">Configure final options for your product</p>
                        </div>

                        <div className="space-y-6">

                            {/* Layout Type */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                {/* left block */}
                                <div className="max-w-xs">   {/* limit width so text no stretch too wide */}
                                    <Label className="text-sm font-medium text-gray-900">
                                        Layout Type
                                    </Label>
                                    <p className="text-xs text-gray-600">
                                        Toggle ON for a fully responsive template, OFF for fixed-width.
                                    </p>
                                </div>

                                {/* right block */}
                                <div className="flex items-center justify-between sm:justify-end gap-2">
                                    <span className="text-xs text-gray-700">
                                        {formData.layout}
                                    </span>

                                    <Switch
                                        checked={formData.layout === "Responsive"}
                                        onCheckedChange={(checked) =>
                                            handleChange("layout", checked ? "Responsive" : "Non-Responsive")
                                        }
                                        className="data-[state=checked]:bg-green-500"
                                    />
                                </div>
                            </div>



                            {/* License Type */}
                            <div>
                                <Label htmlFor="license" className="text-sm text-gray-700">
                                    License Type
                                </Label>
                                <p className="text-xs text-gray-500 mb-2">
                                    Choose the license type that defines how customers can use your product
                                </p>
                                <Select value={formData.license} onValueChange={(value) => handleChange("license", value)}>
                                    <SelectTrigger className="bg-white border border-gray-300 text-gray-900 focus:border-green-500 focus:ring-1 focus:ring-green-500">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {licenseTypes.map((license) => (
                                            <SelectItem key={license} value={license}>
                                                {license.charAt(0).toUpperCase() + license.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="overview" className="text-sm text-gray-700">
                                    Product Overview
                                </Label>
                                <p className="text-xs text-gray-500 mb-2">
                                    Write a detailed description of your product, its benefits, and what makes it unique
                                </p>

                                {/* Wrapper for positioning */}
                                <div className="relative">
                                    {/* <Textarea
                                    id="overview"
                                    placeholder="Describe your product, its key benefits, unique features, and what problems it solves..."
                                    value={formData.overview}
                                    onChange={(e) => handleChange("overview", e.target.value)}
                                    className="bg-white border border-gray-300 text-gray-900 placeholder-gray-500 min-h-[120px] focus:border-green-500 focus:ring-1 focus:ring-green-500 pr-10" // extra padding for icon
                                /> */}

                                    <Textarea
                                        id="overview"
                                        placeholder="Describe your product..."
                                        value={`${formData.overview}${interimTranscript ? ' ' + interimTranscript : ''}`}
                                        onChange={(e) => handleChange("overview", e.target.value)}
                                        className="..."
                                    />


                                    {/* Mic icon button */}
                                    <button
                                        type="button"
                                        onClick={handleMicClick} // You can define this function
                                        className="absolute bottom-2 right-2 bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100 focus:outline-none"
                                        title="Record voice"
                                    >

                                        {/* Recording indicator */}
                                        {recording && (
                                            <div className="absolute bottom-0 right-10 flex items-center space-x-1 animate-pulse text-red-600 text-xs">
                                                <span className="w-2 h-2 bg-red-600 rounded-full" />
                                                <span>Recording…</span>
                                            </div>
                                        )}

                                        {
                                            !recording ? <Mic className="h-4 w-4 text-gray-600" /> : <StopCircle className="h-4 w-4 text-red-600" />
                                        }
                                    </button>
                                </div>

                                {errors.overview && <p className="text-red-500 text-xs mt-1">{errors.overview}</p>}
                            </div>


                            {/* Is Published */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                {/* left block */}
                                <div className="max-w-xs">   {/* limit width so text no stretch too wide */}
                                    <Label className="text-sm font-medium text-gray-900">
                                        Publish
                                    </Label>
                                    <p className="text-xs text-gray-600">
                                        Toggle ON to go Live or OFF to Save to Draft.
                                    </p>
                                </div>

                                {/* right block */}
                                <div className="flex items-center justify-between sm:justify-end gap-2">
                                    <span className="text-xs text-gray-700">
                                        {formData.isPublished ? 'Live' : 'Draft'}
                                    </span>

                                    <Switch
                                        checked={formData.isPublished}
                                        onCheckedChange={(checked) =>
                                            handleChange("isPublished", checked)
                                        }
                                        className="data-[state=checked]:bg-green-500"
                                    />
                                </div>
                            </div>

                        </div>



                        <div className="flex justify-between pt-4 gap-2">
                            <Button
                                variant="ghost"
                                onClick={prevStep}
                                disabled={step === 1}
                                className="text-gray-600 bg-gray-100 hover:text-gray-900 disabled:opacity-50"
                            >
                                Back
                            </Button>
                            <Button onClick={nextStep} className="bg-green-500 hover:bg-green-600 text-white px-4 sm:px-8">
                                Continue
                            </Button>
                        </div>

                    </div>
                )

            /* ────────────────────────────────────────────────────────── */
            /* STEP 11 – Preview + fixed footer                          */
            /* ────────────────────────────────────────────────────────── */
            case 11:
                return (
                    /* flex column so top pane can scroll and footer stays put */
                    <div className="w-full max-w-full sm:max-w-3xl flex flex-col">

                        {/* ── Scrollable preview ─────────────────────────────── */}
                        <div className="flex-1 overflow-y-auto space-y-6 pr-3 max-h-[calc(100vh-14rem)]">

                            <h1 className="text-3xl font-bold text-gray-900 text-center">
                                Review Your Listing
                            </h1>

                            {/* BASIC INFO */}
                            <section className="border rounded-lg p-2">
                                <h2 className="mb-2 text-sm font-semibold text-gray-900">Basic Information</h2>
                                <p className="text-xs text-gray-600"><strong>Sell Type:</strong> {formData.sellType}</p>
                                <p className="text-xs text-gray-600"><strong>Title:</strong> {formData.title}</p>
                                <p className="text-xs text-gray-600"><strong>Category:</strong> {formData.isCategory}</p>
                            </section>

                            {/* IMAGES */}
                            <section className="border rounded-lg p-2">
                                <h2 className="text-sm font-semibold mb-2">Images</h2>
                                {typeof window !== "undefined" && formData.uploadedImages.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {formData.uploadedImages.map((file, i) => (
                                            <img
                                                key={i}
                                                src={URL.createObjectURL(file)}
                                                alt={`img-${i}`}
                                                className="w-24 h-24 object-cover rounded"
                                            />
                                        ))}
                                    </div>
                                )}
                            </section>

                            {/* PRICING */}
                            <section className="border rounded-lg p-2">
                                <h2 className="text-sm font-semibold mb-2">Pricing</h2>
                                <p className="text-xs text-gray-600"><strong>NGN:</strong> {formatPrice(formData.priceNGN)}</p>
                                <p className="text-xs text-gray-600"><strong>USD:</strong> {formatPrice(formData.priceUSD)}</p>
                            </section>

                            {/* SUPPORT & CONTACT */}
                            <section className="border rounded-lg p-2">
                                <h2 className="text-sm font-semibold mb-2">Support &amp; Help</h2>
                                <ul className="list-disc list-inside text-xs">
                                    {formData.preferredContact.map(c => (
                                        <li key={c.type}>{c.type}: {c.value}</li>
                                    ))}
                                </ul>
                                {formData.helpDurationSettings.map(s => (
                                    <p key={s.type} className="text-xs">
                                        <strong className="capitalize">{s.type} Help:</strong> {helpDurationLabels[s.duration]}&nbsp;
                                        — USD {formatPrice(s.feeUSD || 0)} / NGN {formatPrice(s.feeNGN || 0)}
                                    </p>
                                ))}
                            </section>

                            {/* DEMO (if applicable) */}
                            {(formData.sellType === "Complete Projects" || formData.sellType === "Template") && (
                                <section className="border rounded-lg p-2">
                                    <h2 className="text-sm font-semibold mb-2">Demo Links</h2>
                                    <p className="text-xs text-gray-600"><strong>Demo URL:</strong> {formData.protocol + formData.demoUrl || "–"}</p>
                                    <p className="text-xs text-gray-600"><strong>Admin Demo URL:</strong> {formData.adminProtocol + formData.adminDemoUrl || "–"}</p>
                                </section>
                            )}

                            {/* DOWNLOAD */}
                            <section className="border rounded-lg p-2">
                                <h2 className="text-sm font-semibold mb-2">Download</h2>
                                <p className="text-xs text-gray-600"><strong>Download URL:</strong> {formData.downloadProtocol + formData.downloadUrl}</p>
                                <p className="whitespace-pre-wrap text-xs">{formData.downloadInstructions}</p>
                            </section>

                            {/* FEATURES / TAGS */}
                            <section className="border rounded-lg p-2">
                                <h2 className="text-sm font-semibold mb-2">Features &amp; Tags</h2>
                                <p className="text-xs text-gray-600">{formData.features.join(", ") || "–"}</p>
                                <p className="text-xs text-gray-600">{formData.tags.join(", ") || "–"}</p>
                            </section>

                            {/* ADDITIONAL DETAILS */}
                            <section className="border rounded-lg p-4">
                                <h2 className="text-sm font-semibold mb-2">Additional Details</h2>
                                <p className="text-xs text-gray-600"><strong>Built With:</strong> {formData.builtWith.join(", ") || "–"}</p>
                                <p className="text-xs text-gray-600"><strong>Suitable For:</strong> {formData.suitableFor.join(", ") || "–"}</p>
                                <p className="text-xs text-gray-600"><strong>Layout:</strong> {formData.layout}</p>
                                <p className="text-xs text-gray-600"><strong>License:</strong> {formData.license}</p>
                            </section>

                            {/* OVERVIEW */}
                            <section className="border rounded-lg p-4">
                                <h2 className="text-sm font-semibold mb-2">Product Overview</h2>
                                <p className="whitespace-pre-wrap text-xs">{formData.overview}</p>
                            </section>
                        </div>

                        {/* ── Fixed footer with action buttons ─────────────────── */}
                        <div className="border-t pt-4 mt-4 flex justify-between bg-white">
                            <Button
                                variant="ghost"
                                onClick={prevStep}
                                className="text-gray-600 bg-gray-100 hover:text-gray-900"
                            >
                                Back
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                className="bg-green-600 hover:bg-green-600 text-white px-6"
                            >
                                {formData.isPublished ? 'Submit' : 'Save'} Listing
                            </Button>
                        </div>
                    </div>
                );

            default:
                return null
        }
    }

    return (
        <>
            <ProgressOverlay show={isProgressBar.status} subtitle={"Please wait..."} title={isProgressBar.message} />

            {showSuccess && (
                <SuccessSplash
                    onClose={() => setShowSuccess(false)}
                    subtitle={
                        formData.isPublished
                            ? "Your listing is now live and pending approval. Our team will review it shortly! 🚀"
                            : "Your listing has been saved as a draft. You can publish it anytime from your dashboard. 💾"
                    }
                />
            )}

            {showSpeechHelp && (
                <Dialog open={true} onOpenChange={() => setShowSpeechHelp(false)}>
                    <DialogContent className="w-full max-w-full max-h-[90vh] p-6 flex flex-col bg-white text-gray-900 border-0 sm:max-w-md overflow-hidden [&>button]:hidden">




                        <VisuallyHidden>
                            <DialogTitle>Speech Recognition Unsupported</DialogTitle>
                        </VisuallyHidden>

                        <div className="flex items-center justify-between border-b border-gray-200">
                            <div className="flex items-center gap-4">
                                <h2 className="text-lg font-semibold text-red-500 mb-2">Speech Recognition Not Supported</h2>
                            </div>
                            <div className="text-sm text-gray-600">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowSpeechHelp(false)}
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    <X className="h-6 w-6 text-red-500" />
                                </Button>

                            </div>
                        </div>


                        <p className="text-sm text-gray-600 mb-4">
                            Your current browser <strong className="text-red-500">({browserName})</strong> does not support speech recognition.
                        </p>
                        <p className="text-sm text-gray-600">
                            Try using the latest version of <strong className="text-green-500">Google Chrome</strong> or <strong className="text-green-500">Microsoft Edge</strong> on Desktop or Android.
                        </p>

                        <button
                            onClick={() => setShowSpeechHelp(false)}
                            className="mt-6 self-end bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
                        >
                            Okay, Got it
                        </button>
                    </DialogContent>
                </Dialog>
            )}

            <Dialog open={open} onOpenChange={handleCloseClick}>
                {/*<DialogContent className="w-full max-w-full h-full p-0 flex flex-col bg-white text-gray-900 border-0 sm:max-w-4xl sm:h-auto">*/}
                <DialogContent className="w-full max-w-full max-h-[90vh] p-0 flex flex-col bg-white text-gray-900 border-0 sm:max-w-4xl overflow-hidden [&>button]:hidden">
                    <VisuallyHidden>
                        <DialogTitle>Create a product</DialogTitle>
                    </VisuallyHidden>
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCloseClick}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                <X className="h-6 w-6 text-red-500" />
                            </Button>
                            <h2 className="text-lg font-semibold text-gray-900">Create a product</h2>
                        </div>
                        <div className="text-sm text-gray-600">
                            Step {step} of {totalSteps}
                        </div>
                    </div>


                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 h-1">
                        <div
                            className="bg-green-500 h-1 transition-all duration-300"
                            style={{ width: `${(step / totalSteps) * 100}%` }}
                        />
                    </div>

                    {/* Main content */}
                    {step === 11 ? (
                        /* ── Step 11: single-column preview ───────────────────────────── */
                        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-12">
                            {renderStep()}
                        </div>
                    ) : (
                        /* ── All other steps: form + illustration split ───────────────── */
                        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                            {/* Left: form */}
                            <div className="flex-[3] flex flex-col overflow-hidden">
                                <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-12 py-4 sm:py-6 lg:py-12">
                                    {renderStep()}
                                </div>
                            </div>

                            {/* Right: illustration */}
                            <div className="hidden lg:flex flex-[1] items-center justify-center p-12">
                                <div className="relative">
                                    <img
                                        src={stepImages[step - 1] || "/placeholder.svg"}
                                        alt={`Step ${step} illustration`}
                                        className="max-w-full max-h-[500px] object-contain opacity-80"
                                        height={150}
                                        width={200}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-100/20 to-transparent rounded-lg" />
                                </div>
                            </div>
                        </div>
                    )}



                </DialogContent>
            </Dialog>

            {/* Confirmation Modal */}
            <Dialog open={showConfirmClose} onOpenChange={setShowConfirmClose}>
                <DialogContent className="max-w-md bg-white">
                    <VisuallyHidden>
                        <DialogTitle>Are you sure</DialogTitle>
                    </VisuallyHidden>
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Are you sure you want to close?</h3>
                        <p className="text-gray-600 mb-6">All your progress will be lost and cannot be recovered.</p>
                        <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setShowConfirmClose(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleClose} className="bg-red-600 hover:bg-red-700 text-white">
                                Yes, Close
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Contact Method Modal */}
            <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
                <DialogContent className="max-w-md bg-white">
                    <VisuallyHidden>
                        <DialogTitle>Add Method</DialogTitle>
                    </VisuallyHidden>
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Contact Method</h3>

                        {currentContactMethod && (
                            <p className="text-xs text-green-500 mb-4">
                                You can only add one contact method at a time. To add more, please add this one and come back to add another one.
                            </p>
                        )
                        }

                        <div className="space-y-4">
                            <div>
                                <Label className="text-sm text-gray-700">Contact Method</Label>
                                <Select value={currentContactMethod} onValueChange={setCurrentContactMethod}>
                                    <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                                        <SelectValue placeholder="Select contact method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {contactMethods.map((method) => (
                                            <SelectItem key={method} value={method}>
                                                {method}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {currentContactMethod && (
                                <div>
                                    <Label className="text-sm text-gray-700">
                                        {currentContactMethod === "Email"
                                            ? "Email Address"
                                            : currentContactMethod === "WhatsApp"
                                                ? "WhatsApp Number"
                                                : "Phone Number"}
                                    </Label>
                                    <Input
                                        type={currentContactMethod === "Email" ? "email" : "tel"}
                                        value={
                                            currentContactMethod === "Email"
                                                ? user.email || currentContactValue
                                                : user.generalInfo?.phone || currentContactValue
                                        }
                                        placeholder={
                                            (currentContactMethod === "Email" && !user.email)
                                                ? "your@email.com"
                                                : (currentContactMethod !== "Email" && !user.generalInfo?.phone)
                                                    ? (currency === "NGN" ? "+234XXXXXXXXXX" : "+1XXXXXXXXXX")
                                                    : undefined
                                        }
                                        // disabled={
                                        //     (currentContactMethod === "Email" && !!user.email) ||
                                        //     (currentContactMethod !== "Email" && !!user.phone)
                                        // }
                                        readOnly={
                                            (currentContactMethod === "Email" && !!user.email) ||
                                            (currentContactMethod !== "Email" && !!user?.generalInfo?.phone)
                                        }
                                        onChange={(e) => setCurrentContactValue(e.target.value)}
                                        className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <Button variant="outline" onClick={() => setShowContactModal(false)}>
                                Cancel
                            </Button>
                            <Button
                                onClick={addContactMethod}
                                disabled={
                                    !currentContactMethod ||
                                    (
                                        currentContactMethod === "Email"
                                            ? !(user.email || currentContactValue.trim())
                                            : !(user.generalInfo?.phone || currentContactValue.trim())
                                    )
                                }
                                className="bg-green-500 hover:bg-green-600 text-white"
                            >
                                Add
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>


            <Dialog open={showHelpDurationModal} onOpenChange={setShowHelpDurationModal}>
                <DialogContent className="max-w-md bg-white">
                    <VisuallyHidden>
                        <DialogTitle>Settings</DialogTitle>
                    </VisuallyHidden>
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Help Duration Setting</h3>
                        <div className="space-y-4">
                            <div>
                                <Label className="text-sm text-gray-700">Help Type</Label>
                                <Select
                                    value={currentHelpType}
                                    onValueChange={(value: "author" | "extended") => setCurrentHelpType(value)}
                                >
                                    <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem
                                            value="author"
                                            disabled={formData.helpDurationSettings.some((s) => s.type === "author")}
                                        >
                                            Author Help {formData.helpDurationSettings.some((s) => s.type === "author") && "(Already added)"}
                                        </SelectItem>
                                        <SelectItem
                                            value="extended"
                                            disabled={formData.helpDurationSettings.some((s) => s.type === "extended")}
                                        >
                                            Extended Help{" "}
                                            {formData.helpDurationSettings.some((s) => s.type === "extended") && "(Already added)"}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className="text-sm text-gray-700">Duration</Label>
                                <Select value={tempHelpDuration} onValueChange={setTempHelpDuration}>
                                    <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {helpDurations.map((duration) => (
                                            <SelectItem key={duration} value={duration}>
                                                {helpDurationLabels[duration]}
                                            </SelectItem>
                                        ))}

                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm text-gray-700">Fee (USD)</Label>
                                    <Input
                                        type="text"
                                        placeholder={currentHelpType === "author" ? "0 (Free)" : "0 (Free) or set price"}
                                        value={
                                            currentHelpType === "author" ? formatPrice(0) : tempHelpFeeUSD ? formatPrice(tempHelpFeeUSD) : ""
                                        }
                                        disabled={currentHelpType === "author"}
                                        onChange={(e) => {
                                            if (currentHelpType === "author") return
                                            const numValue = parsePrice(e.target.value)
                                            setTempHelpFeeUSD(numValue || "")
                                        }}
                                        className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                                    />
                                </div>

                                <div>
                                    <Label className="text-sm text-gray-700">Fee (NGN)</Label>
                                    <Input
                                        type="text"
                                        placeholder={currentHelpType === "author" ? "0 (Free)" : "0 (Free) or set price"}
                                        value={
                                            currentHelpType === "author" ? formatPrice(0) : tempHelpFeeNGN ? formatPrice(tempHelpFeeNGN) : ""
                                        }
                                        disabled={currentHelpType === "author"}
                                        onChange={(e) => {
                                            if (currentHelpType === "author") return
                                            const numValue = parsePrice(e.target.value)
                                            setTempHelpFeeNGN(numValue || "")
                                        }}
                                        className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                                    />
                                </div>
                                {currentHelpType === "author" && (
                                    <div className="col-span-2 text-xs text-gray-500 mt-2">
                                        <ul className="list-disc list-inside space-y-1">
                                            <li>
                                                <strong className="text-red-600">Note:</strong> Author help is included in the product price —
                                                no additional fee is required.
                                            </li>
                                            <li>You can only set the duration for author help (no fee is needed).</li>
                                            <li>
                                                Extended help can only be set after you have configured author help. It allows you to set both
                                                duration and fee.
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <Button variant="outline" onClick={() => setShowHelpDurationModal(false)}>
                                Cancel
                            </Button>
                            <Button
                                onClick={addHelpDuration}
                                disabled={formData.helpDurationSettings.some((s) => s.type === currentHelpType)}
                                className="bg-green-500 hover:bg-green-600 text-white"
                            >
                                Add
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Login Details Modal */}
            <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
                <DialogContent className="max-w-md bg-white">
                    <VisuallyHidden>
                        <DialogTitle>Details</DialogTitle>
                    </VisuallyHidden>
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Add {loginUrlType === "demo" ? "Demo" : "Admin"} Test Credential
                        </h3>

                        <div className="bg-green-50 p-2 rounded">
                            <p className="text-xs text-green-500">
                                Buyer will use this test credential to explore the {loginUrlType === "demo" ? "User" : "Admin"} dashboard functionality.
                            </p>
                        </div>


                        <div className="space-y-4">
                            <div>
                                <Label className="text-sm text-gray-700">Username *</Label>
                                <Input
                                    placeholder={loginUrlType === "demo" ? "User" : "Admin"}
                                    value={tempLoginDetails.username}
                                    onChange={(e) => setTempLoginDetails((prev) => ({ ...prev, username: e.target.value }))}
                                    className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                                />
                            </div>

                            <div>
                                <Label className="text-sm text-gray-700">Password *</Label>
                                <Input
                                    placeholder="password"
                                    value={tempLoginDetails.password}
                                    onChange={(e) => setTempLoginDetails((prev) => ({ ...prev, password: e.target.value }))}
                                    className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <Button variant="outline" onClick={() => setShowLoginModal(false)}>
                                Cancel
                            </Button>
                            <Button
                                onClick={addLoginDetail}
                                disabled={!tempLoginDetails.username || !tempLoginDetails.password}
                                className="bg-green-500 hover:bg-green-600 text-white"
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
