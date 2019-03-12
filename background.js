var lastMacClient = getMacClient();

setInterval(function () {
	var newListArray = getMacClient();

	var newClient = getNewClient(newListArray);
	lastMacClient = newListArray;

	if (newClient[0] == undefined) {
		return;
	}

	for (var i in newClient) {
		var notific = new window.Notification('Новый клиет Wi-Fi', {
			icon:"favicon.png",
			body:"Имя: " + newClient[i][1] + "\nMAC: " + newClient[i][0]
		})
	}
}, 2000);

function getMacClient () {
	var listClient = [];

	var XMLRequest = new XMLHttpRequest();

	XMLRequest.open('POST', 'http://192.168.1.1/ci', false, 'admin', '1234');
	XMLRequest.setRequestHeader('Content-Type', 'application/xml');
	XMLRequest.send('<?xml version="1.0" encoding="UTF-8"?><packet><request id="client"><command name="show associations" /></request><request id="name"><command name="show ip arp"><alive>alive</alive></command></request></packet>');

	var XMLdom = XMLRequest.responseXML;

	var clients = XMLdom.getElementById('client').getElementsByTagName('station');
	var nameClients = XMLdom.getElementById('name').getElementsByTagName('arp');
	var countClient = clients.length;

	for (var i = 0; i < countClient; i++) {
		var mac = clients[i].getElementsByTagName('mac')[0].innerHTML;
		var name = getNameUser(mac, nameClients);

		listClient[mac] = name;
	}

	return listClient;
}

function getNameUser (mac, nameClients) {
	var countNameClient = nameClients.length;

	for (var i = 0; i < countNameClient; i++) {
		if (nameClients[i].getElementsByTagName('mac')[0].innerHTML === mac && nameClients[i].getElementsByTagName('name').length != 0) {
			return nameClients[i].getElementsByTagName('name')[0].innerHTML;
		}
	}

	return '???';
}

function getCountIndexArray (newArray, oldArray) {
	var hash = [];

	for (var i in oldArray) {
		if (hash[i] == undefined) {
			hash[i] = 1;
		}
		else {
			hash[i] += 1;
		}
	}

	for (var i in newArray) {
		if (hash[i] == undefined) {
			hash[i] = 1;
		}
		else {
			hash[i] += 1;
		}
	}

	return hash;
}

function getNewClient (newArray) {
	var newClient = [];
	var hash = getCountIndexArray(newArray, lastMacClient);

	for (var mac in hash) {
		var count = hash[mac];

		if (count == 1 && newArray[mac] != undefined) {
			newClient.push([mac, newArray[mac]]);
		}
	}

	return newClient;
}