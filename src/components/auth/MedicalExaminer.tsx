import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const MedicalExaminer = () => {
  return (
    <div className="bg-dashboard-card rounded-lg shadow-lg p-8 mb-12">
      <h2 className="text-2xl font-bold text-white mb-6">Medical Examiner Process</h2>
      <p className="text-dashboard-text mb-4">
        To understand our comprehensive Medical Examiner Death Certification process, please review our detailed Medical Examiner Flow Chart.
      </p>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="text-dashboard-accent1 border-dashboard-accent1 hover:bg-dashboard-accent1 hover:text-white">
            View Flow Chart
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[95vw] w-[1200px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">Medical Examiner Flow Chart</DialogTitle>
            <DialogDescription>
              Review the complete process and fee structure below
            </DialogDescription>
          </DialogHeader>
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
              <p className="text-gray-700 mb-4">
                Fees, payments and sums are fixed under section 15 (1) of the Local Authorities
                Cemeteries Orders 1977 – to take effect from the 1st April 2024
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold mt-4 mb-2">Graves for which NO Exclusive Right of Burial has been granted</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>A child in the Forget Me Not Garden</span>
                      <span className="font-semibold">No charge</span>
                    </div>
                    <div className="flex justify-between">
                      <span>A stillborn child or child whose age at the time of death did not exceed 16 years (in an unpurchased grave)</span>
                      <span className="font-semibold">No charge</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Child from outside of East Staffordshire</span>
                      <span className="font-semibold">£48.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>A person whose age at the time of death exceeded 16 years</span>
                      <span className="font-semibold">£792.00</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold mt-4 mb-2">Graves for which an EXCLUSIVE RIGHT OF BURIAL has been granted</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Purchase of Exclusive Right of Burial</span>
                      <span className="font-semibold">£1,245.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Purchase of Exclusive Right of Burial for cremated remains</span>
                      <span className="font-semibold">£433.00</span>
                    </div>
                  </div>

                  <h4 className="font-bold mt-6 mb-2">Additional Fees</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Additional cost for bricked grave</span>
                      <span className="font-semibold">£219.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Burial of cremated remains</span>
                      <span className="font-semibold">£219.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Admin charge for multiple interments</span>
                      <span className="font-semibold">£54.00</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="font-bold mb-4">Miscellaneous Charges</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Transfer of ownership of Exclusive Right of Burial</span>
                    <span className="font-semibold">£57.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Slabbing or sealing a grave</span>
                    <span className="font-semibold">£168.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Preparation for the exhumation of a body (administration costs)</span>
                    <span className="font-semibold">£1,265.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fees for searches of Registers including copy of entry</span>
                    <span className="font-semibold">£26.00</span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="font-bold mb-4">Monuments, Gravestones, Tablets & Monumental Inscriptions</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>A gravestone, cross, book or scroll (standard size)</span>
                    <span className="font-semibold">£378.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>The Forget-Me-Not Memorial</span>
                    <span className="font-semibold">£60.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>The Forget-Me-Not Vase</span>
                    <span className="font-semibold">£48.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>The Forget Me Not Plaque: double (incl. VAT)</span>
                    <span className="font-semibold">£227.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kerb memorial</span>
                    <span className="font-semibold">£889.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Full kerbset (kerbs & headstone)</span>
                    <span className="font-semibold">£1,267.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Memorial replacement fee</span>
                    <span className="font-semibold">£120.00</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold mb-4">Standing Regulations</h4>
                <p className="text-sm text-gray-700">
                  The fees set out apply only to those residing in the Borough of East Staffordshire
                  at the time of death. The normal requirement for residency is that the deceased lived within
                  the Borough for the twelve months prior to death.
                </p>
                <p className="text-sm text-gray-700 mt-4">
                  For non-residents the interment fee and, where applicable, the Exclusive Right of Burial fee
                  is trebled. Non-residents are only exempt the trebling of these fees if either of the following
                  criteria apply:
                </p>
                <ol className="list-decimal pl-5 mt-2 space-y-2 text-sm text-gray-700">
                  <li>The deceased had previously lived within the Borough within the last 20 years for
                    a period exceeding 5 years</li>
                  <li>The deceased was a former resident within the Borough within the last 20 years
                    for a period exceeding 5 years but moved outside the Borough to a rest/nursing
                    home.</li>
                </ol>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MedicalExaminer;