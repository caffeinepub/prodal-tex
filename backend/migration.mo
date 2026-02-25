import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Time "mo:core/Time";

module {
  type OldFabricProduct = {
    id : Nat;
    name : Text;
    description : Text;
    fabricType : Text;
    color : Text;
    weightGSM : Nat;
    widthCM : Nat;
    minOrderQuantity : Nat;
    pricePerMeter : Float;
    imageFilename : Text;
  };

  type OldCustomerInquiry = {
    id : Nat;
    customerName : Text;
    email : Text;
    phone : Text;
    companyName : ?Text;
    productId : Nat;
    quantityRequired : Nat;
    message : Text;
    timestamp : Time.Time;
  };

  type OldActor = {
    nextProductId : Nat;
    nextInquiryId : Nat;
    fabricProducts : Map.Map<Nat, OldFabricProduct>;
    customerInquiries : Map.Map<Nat, OldCustomerInquiry>;
  };

  type NewFabricProduct = {
    id : Nat;
    name : Text;
    description : Text;
    fabricType : Text;
    color : Text;
    weightGSM : Nat;
    widthCM : Nat;
    minOrderQuantity : Nat;
    pricePerMeter : Float;
    imageFilename : Text;
  };

  type NewCustomerInquiry = {
    id : Nat;
    customerName : Text;
    email : Text;
    phone : Text;
    companyName : ?Text;
    productId : Nat;
    quantityRequired : Nat;
    message : Text;
    timestamp : Time.Time;
  };

  type NewActor = {
    nextProductId : Nat;
    nextInquiryId : Nat;
    fabricProducts : Map.Map<Nat, NewFabricProduct>;
    customerInquiries : Map.Map<Nat, NewCustomerInquiry>;
  };

  public func run(old : OldActor) : NewActor {
    {
      nextProductId = old.nextProductId;
      nextInquiryId = old.nextInquiryId;
      fabricProducts = old.fabricProducts;
      customerInquiries = old.customerInquiries;
    };
  };
};
