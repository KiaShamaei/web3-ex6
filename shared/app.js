var search = document.getElementById('search');
var select = document.getElementById('type');
var form = document.querySelector('form[data-name="add-edit"]');
var res = null;
var result = {
    users: []
};
function handleDelete (r){
	var recordDtl =r.getAttribute('data-name');
	console.log(recordDtl)
	for (var i in res.users)
	if (res.users[i].name==recordDtl) res.users.splice(i,1);
	document.getElementById('output').innerHTML  = render(res, 'user-template');
}

function render(data, id) {
    var source = document.getElementById(id).innerHTML;
    var template = Handlebars.compile(source);
    return template(data);
}

function loadJSON(m, u, d, c) {
    var xHR = new XMLHttpRequest;
    xHR.onreadystatechange = function() {
        if(xHR.readyState == 4 && xHR.status == 200) {
            res = JSON.parse(xHR.response)
            c(res);
        }

        else if(xHR.readyState == 4 && xHR.status == 404) {
            c();
        }
    }
    xHR.open(m, u, true);
    xHR.send(d);
}

function finder(input, select) {
    var finds = [];
    switch(select) {
        case "not":
            for(var i = 0; i < res.users.length; i++) {
                if(res.users[i].name.includes(input) && !res.users[i].confirmed) {
                    finds.push(res.users[i]);
                }
            }
            break;
        case "con":
            for(var i = 0; i < res.users.length; i++) {
                if(res.users[i].name.includes(input) && res.users[i].confirmed) {
                    finds.push(res.users[i]);
                }
            }
            break;
        default:
            for(var i = 0; i < res.users.length; i++) {
                if(res.users[i].name.includes(input)) {
                    finds.push(res.users[i]);
                }
            }
    }
    return finds;
}

function eventHandler() {
    result.users = finder(search.value, select.value);
    document.getElementById('output').innerHTML  = render(result, 'user-template');
}

function formValidation(d) {
    try {
        if(!d.name) {
            // document.querySelector('input[name="name"]').classList.add('error');
            throw 'Name is required';
        } else if(!d.count || d.count < 0) {
            // alert('Count must be greater than 0');
            throw('Count must be greater than 0');
        }
        return true;
    } catch (error) {
        document.getElementById('error').innerHTML = '<i class="las la-exclamation-circle"></i> ' + error;
        return false;
    }
}

loadJSON('GET', 'http://my-json-server.typicode.com/mkazemiraz/fakeDB/db', null, function(r) {
    document.getElementById('output').innerHTML  = render(r, 'user-template');
});

search.addEventListener('keyup', eventHandler);
select.addEventListener('change', eventHandler);

form.addEventListener('submit', function() {
    event.preventDefault();
    // document.querySelectorAll('.error').forEach(function(el) {
    //     el.classList.remove('error');
    // });
    document.getElementById('error').innerHTML = "";
    var data = {
        "name": this.elements.name.value,
        "count": this.elements.count.value,
        "confirmed": this.elements.confirmed.checked
    };

    if(formValidation(data)){
        loadJSON("POST", "http://my-json-server.typicode.com/mkazemiraz/fakeDB/db", JSON.stringify(data), function() {
            res.users.push(data);
            document.getElementById('output').innerHTML  = render(res, 'user-template');
        });
    }
});











