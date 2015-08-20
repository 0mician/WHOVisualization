var fs = require('fs');
var cor, neg_cor = [], pos_cor = [];

var resp = [],
    resn = [];

fs.readFile('./cor.json', 'utf8', function(err, c) {
    if(err) throw err;
    cor = JSON.parse(c);
    // cleaning up objects irrelevant to cor matrix
    for(var i = 0; i < cor.length; i++) {
        delete cor[i]['_id'];
    }
    
    var line;
    for(var i = 0; i < cor.length; i++){
        line = 0;
        for(var key in cor[i]){
            if (line == 0)
                var header = cor[i][key];
            if(line>i){
                break; // eliminates upper diagonal of cor matrix (redundant info)
            }
            else {
                if(cor[i][key] > 0.6){
                    pos_cor.push({"var1":key, "var2":header, "cor":cor[i][key]});
                }
                if(cor[i][key] < -0.6){
                    neg_cor.push({"var1":key, "var2":header, "cor":cor[i][key]});
                }
            }
            line++;
        }
    }

    pos_cor.sort(function(a, b){
        return b.cor-a.cor;
    });

    neg_cor.sort(function(a, b){
        return a.cor-b.cor;
    });

    var sizep = Math.ceil(Math.sqrt(pos_cor.length)),
        sizen = Math.ceil(Math.sqrt(neg_cor.length));


    while (pos_cor.length > 0)
        resp.push(pos_cor.splice(0, 50));
    
    while (neg_cor.length > 0)
        resn.push(neg_cor.splice(0, 50));
    
    save_results();
});

function save_results(){
    fs.writeFile("pos_cor.json", JSON.stringify(resp, null, 4), function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("JSON saved");
        }
    }); 
    fs.writeFile("neg_cor.json", JSON.stringify(resn, null, 4), function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("JSON saved");
        }
    }); 
}


