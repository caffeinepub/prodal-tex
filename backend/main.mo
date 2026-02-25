import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Migration "migration";

(with migration = Migration.run)
actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

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
  let customerInquiries = Map.empty<InquiryId, CustomerInquiry>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextProductId : ProductId = 1;
  var nextInquiryId : InquiryId = 0;

  // ── User Profile Management ──────────────────────────────────────────────

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // ── Product Management ───────────────────────────────────────────────────

  public shared ({ caller }) func addProduct(
    name : Text,
    description : Text,
    fabricType : Text,
    color : Text,
    weightGSM : Nat,
    width : ProductWidth,
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
      width;
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
      case (?product) { product };
      case (null) { Runtime.trap("Product not found") };
    };
  };

  public query func getAllProducts() : async [FabricProduct] {
    fabricProducts.values().toArray().sort();
  };

  // ── Inquiry Management ───────────────────────────────────────────────────

  public shared ({ caller }) func submitInquiry(
    customerName : Text,
    email : Text,
    phone : Text,
    companyName : ?Text,
    productId : ProductId,
    quantityRequired : Nat,
    message : Text,
  ) : async InquiryId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can submit inquiries");
    };

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
};
