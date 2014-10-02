Saorsa.Utils.IsDebug = true;

describe(".NET preserve reference object functions",function()
{
	beforeEach(function () {
        this.netReferenceObject = {
			person : { $id : 1 },
			company : { $id : 2 },
			manager : { $id : 3 },
			lineManager : { $ref : 3}
		};
		console.log("Rei-initializing the base object");
   	});
	it("Saorsa.Utils.GetReferencesMap should create a two elements reference table", function()
	{
		var referencesMap = Saorsa.Utils.GetReferencesMap(this.netReferenceObject)
		expect(Object.keys(referencesMap).length).toBe(3);
	});
	it("Saorsa.Utils.ReplaceReferences should make line manager same as manager", function()
	{
		Saorsa.Utils.ReplaceReferences(this.netReferenceObject, 
				Saorsa.Utils.GetReferencesMap(this.netReferenceObject),
			3);
		expect(
			this.netReferenceObject.lineManager["$id"]).toBe(3);
	});
	it("Saorsa.Utils.TraverseDocument should find the correct node", function()
	{
		var node = Saorsa.Utils.TraverseDocument(this.netReferenceObject,3);
		expect(
			node["$id"]).toBe(3);
	});
});

describe("String prototype method", function(){
	it("Let's see if startsWith works'", function(){
		expect("Saorsa".startsWith("Sa")).toBe(true);
	})
});

describe("Object with string fields to date", function(){
	it("An array of objects with a field name equals makeMeToDate and a string  value should get the fields as date", function(){
		var obj = { "makeMeToDate" : "18/10/1984" };
		var array = [obj, obj];
		Saorsa.Utils.toDate(array, ["makeMeToDate"]);
		expect(array[0].makeMeToDate instanceof Date).toBe(true);
	})
});