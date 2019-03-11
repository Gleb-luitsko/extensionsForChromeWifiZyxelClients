var idTimer;

updataUser();

function updataUser () {
	var XMLRequest = new XMLHttpRequest();

	XMLRequest.onload = function () {
		var answer = XMLRequest.responseXML;
		var clients = answer.getElementById('client').getElementsByTagName('station');
		var countClient = clients.length;

		var nameClient = answer.getElementById('name').getElementsByTagName('arp');

		deleteElemByClassName('string-table');

		for (var i = 0; i < countClient; i++) {
			var mac = clients[i].getElementsByTagName('mac')[0].innerHTML;
			var name = getNameUser(mac, nameClient);

			var thTableName = document.createElement('th');
			thTableName.innerHTML = name;

			var thTableMac = document.createElement('th');
			thTableMac.innerHTML = mac;

			var trTable = document.createElement('tr');
			trTable.classList.add('string-table');
			trTable.appendChild(thTableName);
			trTable.appendChild(thTableMac);

			bodyTable.appendChild(trTable);
		}

		idTimer = setTimeout(updataUser, 2000);
	}
	XMLRequest.onerror = function () {
		var warning = document.createElement('strong');
		warning.innerHTML = 'Нет&nbsp;сети!';
		warning.classList.add('warning');

		document.body.innerHTML = '';
		document.body.appendChild(warning);
	}

	XMLRequest.open('POST', 'http://192.168.1.1/ci', true, 'admin', '1234');
	XMLRequest.setRequestHeader('Content-Type', 'application/xml');
	XMLRequest.send('<?xml version="1.0" encoding="UTF-8"?><packet><request id="client"><command name="show associations" /></request><request id="name"><command name="show ip arp"><alive>alive</alive></command></request></packet>');
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

function deleteElemByClassName(nameClass) {
	var elemForDelete = document.getElementsByClassName(nameClass);
	var countElement = elemForDelete.length - 1;
	for (var i = countElement; i >= 0; i--)
		elemForDelete[i].remove();
}