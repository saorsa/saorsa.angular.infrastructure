Saorsa.Utils.IsDebug = true;
var netReferenceObject = 
{
	person : { $id : 1 },
	company : { $id : 2 },
	manager : { $id : 3 },
	lineManager : { $ref : 3}
};

describe(".NET preserve reference object functions",function()
{
	it("Saorsa.Utils.GetReferencesMap should create a two elements reference table", function()
	{
		expect(Saorsa.Utils.GetReferencesMap(netReferenceObject).length).toBe(3);
	});
});