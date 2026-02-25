import Map "mo:core/Map";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type ProductId = Nat;
  type InquiryId = Nat;

  // Types
  type FabricProduct = {
    id : ProductId;
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

  public type UserProfile = {
    name : Text;
    email : Text;
    company : ?Text;
  };

  module FabricProduct {
    public func compare(p1 : FabricProduct, p2 : FabricProduct) : Order.Order {
      Nat.compare(p1.id, p2.id);
    };
  };

  module CustomerInquiry {
    public func compare(i1 : CustomerInquiry, i2 : CustomerInquiry) : Order.Order {
      Nat.compare(i1.id, i2.id);
    };
  };

  // Persistent State
  var nextProductId : ProductId = 0;
  var nextInquiryId : InquiryId = 0;

  let fabricProducts = Map.empty<ProductId, FabricProduct>();
  let customerInquiries = Map.empty<InquiryId, CustomerInquiry>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // ── Product Management ───────────────────────────────────────────────────

  public shared ({ caller }) func addProduct(
    name : Text,
    description : Text,
    fabricType : Text,
    color : Text,
    weightGSM : Nat,
    widthCM : Nat,
    minOrderQuantity : Nat,
    pricePerMeter : Float,
    imageFilename : Text,
  ) : async ProductId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };

    let product : FabricProduct = {
      id = nextProductId;
      name;
      description;
      fabricType;
      color;
      weightGSM;
      widthCM;
      minOrderQuantity;
      pricePerMeter;
      imageFilename;
    };

    fabricProducts.add(nextProductId, product);
    nextProductId += 1;
    product.id;
  };

  public query func getProduct(id : ProductId) : async FabricProduct {
    switch (fabricProducts.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  public query func getAllProducts() : async [FabricProduct] {
    fabricProducts.values().toArray().sort();
  };

  // ── Inquiry Management ───────────────────────────────────────────────────

  public shared func submitInquiry(
    customerName : Text,
    email : Text,
    phone : Text,
    companyName : ?Text,
    productId : ProductId,
    quantityRequired : Nat,
    message : Text,
  ) : async InquiryId {
    let inquiry : CustomerInquiry = {
      id = nextInquiryId;
      customerName;
      email;
      phone;
      companyName;
      productId;
      quantityRequired;
      message;
      timestamp = Time.now();
    };

    customerInquiries.add(nextInquiryId, inquiry);
    nextInquiryId += 1;
    inquiry.id;
  };

  public query ({ caller }) func getAllInquiries() : async [CustomerInquiry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all inquiries");
    };
    customerInquiries.values().toArray().sort();
  };

  // ── Sample Data ──────────────────────────────────────────────────────────

  public shared ({ caller }) func initializeSampleProducts() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can initialize sample products");
    };

    _addSampleProduct(
      "Royal Blue Velvet",
      "Luxurious royal blue velvet fabric.",
      "Polyester Knitted Dyed",
      "Royal Blue",
      300,
      150,
      10,
      12.99,
      "royal_blue_velvet.jpg",
    );

    _addSampleProduct(
      "Classic Grey Melange",
      "Soft classic grey melange fabric.",
      "Polyester Knitted Dyed",
      "Grey Melange",
      250,
      145,
      15,
      9.99,
      "grey_melange.jpg",
    );

    _addSampleProduct(
      "Bright Yellow Fleece",
      "Vibrant yellow fleece fabric.",
      "Polyester Knitted Dyed",
      "Bright Yellow",
      350,
      160,
      8,
      14.99,
      "yellow_fleece.jpg",
    );

    _addSampleProduct(
      "Deep Black Lycra",
      "Stretchy deep black lycra fabric.",
      "Polyester Knitted Dyed",
      "Black",
      200,
      140,
      20,
      11.99,
      "black_lycra.jpg",
    );

    _addSampleProduct(
      "Soft Lavender Knit",
      "Soft pastel lavender knit fabric.",
      "Polyester Knitted Dyed",
      "Lavender",
      275,
      150,
      12,
      13.49,
      "lavender_knit.jpg",
    );

    _addSampleProduct(
      "Blush Pink Polyester",
      "Delicate blush pink polyester fabric.",
      "Polyester Knitted Dyed",
      "Blush Pink",
      220,
      145,
      18,
      10.99,
      "blush_pink.jpg",
    );
  };

  func _addSampleProduct(
    name : Text,
    description : Text,
    fabricType : Text,
    color : Text,
    weightGSM : Nat,
    widthCM : Nat,
    minOrderQuantity : Nat,
    pricePerMeter : Float,
    imageFilename : Text,
  ) {
    let product : FabricProduct = {
      id = nextProductId;
      name;
      description;
      fabricType;
      color;
      weightGSM;
      widthCM;
      minOrderQuantity;
      pricePerMeter;
      imageFilename;
    };

    fabricProducts.add(nextProductId, product);
    nextProductId += 1;
  };
};
