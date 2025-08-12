"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, MapPin } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useActiveCurrency } from "@/lib/currencyTag";
import { defaultCurrency } from "@/lib/utils";

interface GeneralInfoStepProps {
  data: any;
  onNext: () => void;
  onPrev: () => void;
  onUpdate: (data: any) => void;
}

const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo (Congo-Brazzaville)",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic (Czechia)",
  "Democratic Republic of the Congo",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini (fmr. Swaziland)",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar (formerly Burma)",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine State",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe"
];


function CountrySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const filtered = countries.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between"
          onClick={() => setOpen(!open)}
        >
          {value || "Select your country"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[300px]">
        <div className="p-2 border-b">
          <Input
            placeholder="Type to search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </div>
        <div className="max-h-48 overflow-y-auto">
          {filtered.length > 0 ? (
            filtered.map((country) => (
              <button
                key={country}
                className="w-full text-left px-2 py-1 hover:bg-gray-100"
                onClick={() => {
                  onChange(country);
                  setSearch("");
                  setOpen(false);
                }}
              >
                {country}
              </button>
            ))
          ) : (
            <div className="p-2 text-sm text-gray-500">No matches</div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default function GeneralInfoStep({
  data,
  onNext,
  onPrev,
  onUpdate,
}: GeneralInfoStepProps) {
  const [generalInfo, setGeneralInfo] = useState(
    data.generalInfo || {
      country: "",
      city: "",
      phone: "",
      address: "",
    }
  );
  const { currency, symbol } = useActiveCurrency(defaultCurrency)
  const handleInputChange = (field: string, value: string) => {
    const updated = { ...generalInfo, [field]: value };
    setGeneralInfo(updated);
    onUpdate({ generalInfo: updated });
  };

  const handleNext = () => {
    if (generalInfo.country && generalInfo.city) {
      onNext();
    }
  };

  useEffect(() => {
    console.log(data, "general info");
  }, []);

  const isValid = generalInfo.country && generalInfo.city && generalInfo.phone;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          General Information
        </h1>
        <p className="text-lg text-gray-600">
          We need some basic information to comply with tax regulations and to
          help customers find local authors.
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>Location & Contact</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Country */}
          <div>
            <Label htmlFor="country">Country *</Label>
            <CountrySelect
              value={generalInfo.country}
              onChange={(val) => handleInputChange("country", val)}
            />
          </div>

          {/* City */}
          <div>
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={generalInfo.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              placeholder="Your city"
              className="mt-1"
            />
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={generalInfo.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder={currency === 'NGN' ? "+234 (706) 467-2661" : "+1 (555) 123-4567"}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Optional - for account verification if needed
            </p>
          </div>

          {/* Address */}
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={generalInfo.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="Your full address"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Optional - may be required for tax purposes in some countries
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="bg-green-50 rounded-lg p-4 mb-8">
        <h3 className="font-semibold text-green-500 mb-2">Privacy Notice</h3>
        <p className="text-sm text-green-500">
          Your personal information is kept private and secure. We only use this
          information for account verification, tax compliance, and to provide
          better localized services. Your address and phone number are never
          shared with customers.
        </p>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Button
          onClick={handleNext}
          disabled={!isValid}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
