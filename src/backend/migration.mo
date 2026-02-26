import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Time "mo:core/Time";

module {
  type ProductId = Nat;
  type InquiryId = Nat;

  // Types
  type ProductWidth = { #centimeters : Nat; #inches : Nat };

  type FabricProduct = {
    id : ProductId;
    name : Text;
    description : Text;
    fabricType : Text;
    color : Text;
    weightGSM : Nat;
    width : ProductWidth;
    minOrderQuantity : Nat;
    pricePerMeter : Float;
    imageFilename : Text;
  };

  type CustomerInquiry = {
    id : InquiryId;
    customerName : Text;
    email : Text;
    phone : Text;
    companyName : ?Text;
    productId : ProductId;
    quantityRequired : Nat;
    message : Text;
    timestamp : Time.Time;
  };

  type UserProfile = {
    name : Text;
    email : Text;
    company : ?Text;
  };

  type OldActor = {
    fabricProducts : Map.Map<ProductId, FabricProduct>;
    customerInquiries : Map.Map<InquiryId, CustomerInquiry>;
    userProfiles : Map.Map<Principal, UserProfile>;
    nextProductId : ProductId;
    nextInquiryId : InquiryId;
  };

  type NewActor = {
    fabricProducts : Map.Map<ProductId, FabricProduct>;
    customerInquiries : Map.Map<InquiryId, CustomerInquiry>;
    userProfiles : Map.Map<Principal, UserProfile>;
    nextProductId : ProductId;
    nextInquiryId : InquiryId;
  };

  public func run(old : OldActor) : NewActor {
    let updatedProducts = old.fabricProducts.map<ProductId, FabricProduct, FabricProduct>(
      func(id, product) {
        if (id == 0) {
          {
            product with
            color = "All colours and RFD available";
            minOrderQuantity = 300;
          };
        } else {
          product;
        };
      }
    );
    { old with fabricProducts = updatedProducts };
  };
};
