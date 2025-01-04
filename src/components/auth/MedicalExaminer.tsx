import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const MedicalExaminer = () => {
  return (
    <div className="bg-dashboard-card rounded-lg shadow-lg p-8 mb-12">
      <h2 className="text-2xl font-bold text-white mb-6">Medical Examiner Process</h2>
      <p className="text-dashboard-text mb-4">
        To understand our comprehensive Medical Examiner Death Certification process, please review our detailed Medical Examiner Flow Chart.
      </p>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="text-dashboard-accent1 border-dashboard-accent1 hover:bg-dashboard-accent1 hover:text-white">
            View Flow Chart
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[90%] sm:w-[80%] overflow-y-auto bg-white">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold text-gray-900">Medical Examiner Flow Chart</SheetTitle>
            <SheetDescription>
              Review the complete process and fee structure below
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            <div className="space-y-4">
              <img 
                src="/lovable-uploads/fe2d6e55-ff9b-4259-8e04-ad013282b7fe.png" 
                alt="Medical Certificate of Cause of Death" 
                className="w-full rounded-lg shadow-md"
              />
              <img 
                src="/lovable-uploads/6e209600-d2c6-452c-aa45-c30e0f473afb.png" 
                alt="Ethnicity and Medical Devices Form" 
                className="w-full rounded-lg shadow-md"
              />
            </div>
            <div className="prose prose-sm max-w-none">
              <h3 className="text-xl font-bold text-gray-900 mb-4">CEMETERY FEES AND CHARGES</h3>
              <p className="text-gray-700 mb-2">
                Fees, payments and sums are fixed under section 15 (1) of the Local Authorities
                Cemeteries Orders 1977 – to take effect from the 1st April 2024
              </p>
              
              <h4 className="font-bold mt-4 mb-2">Graves for which NO Exclusive Right of Burial has been granted</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>A child in the Forget Me Not Garden - No charge</li>
                <li>A stillborn child or child whose age at the time of death did not exceed 16 years (in an unpurchased grave) - No charge</li>
                <li>Child from outside of East Staffordshire - £48.00</li>
                <li>A person whose age at the time of death exceeded 16 years - £792.00</li>
              </ul>

              <h4 className="font-bold mt-4 mb-2">Graves for which an EXCLUSIVE RIGHT OF BURIAL has been granted</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>Purchase of Exclusive Right of Burial - £1,245.00</li>
                <li>Purchase of Exclusive Right of Burial for cremated remains - £433.00</li>
              </ul>

              <h4 className="font-bold mt-4 mb-2">Additional Fees</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>Additional cost for bricked grave - £219.00</li>
                <li>Burial of cremated remains - £219.00</li>
                <li>Admin charge for multiple interments - £54.00</li>
              </ul>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MedicalExaminer;