function skillsMember() {
	var members = [
		{ name: "Tom", skills: ["JavaScript", "CSS", "HTML"] },
		{ name: "Bob", skills: ["JavaScript", "Node.js", "Ruby"] },
		{ name: "Alice", skills: ["Python", "MongoDB"] },
	];
	var result = [];
	members.forEach(function (member) {
		member.skills.forEach(function (skill) {
			if (result.indexOf(skill) === -1) {
				result.push(skill);
			}
		});
	});
	return result;
}
