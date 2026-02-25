import Map "mo:core/Map";
import Nat "mo:core/Nat";

module {
  type ProductId = Nat;
  type InquiryId = Nat;

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
    timestamp : Int;
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
    let fabricProducts = Map.singleton<ProductId, FabricProduct>(
      0,
      {
        id = 0;
        name = "Ferrari Cheque";
        description = "Premium quality 310 GSM fabric, ideal for high-end applications. 60 inch width, minimum 300kg order";
        fabricType = "Knitted";
        color = "Dark Grey";
        weightGSM = 310;
        width = #inches(60);
        minOrderQuantity = 300;
        pricePerMeter = 225.0;
        imageFilename = "ferrari_cheque.jpg";
      },
    );
    {
      old with
      fabricProducts;
      nextProductId = 1;
    };
  };
};
