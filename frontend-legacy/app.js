// Knockout.js ViewModel for Archived Records
function ArchivedRecordsViewModel() {
  var self = this;
  self.searchQuery = ko.observable('');
  self.activeFilter = ko.observable('ALL');
  self.records = ko.observableArray([]);

  self.setFilter = function(filter) { self.activeFilter(filter); };

  self.filteredRecords = ko.computed(function() {
    var q = self.searchQuery().toLowerCase();
    var f = self.activeFilter();
    return self.records().filter(function(r) {
      var matchSearch = !q || r.symbol.toLowerCase().indexOf(q)!==-1 || r.name.toLowerCase().indexOf(q)!==-1;
      var matchFilter = f==='ALL' || r.type===f;
      return matchSearch && matchFilter;
    });
  });

  self.totalRecords = ko.computed(function() { return self.records().length; });
  self.totalValue = ko.computed(function() {
    return self.records().reduce(function(s,r){ return s+(r.price*r.quantity); },0);
  });

  // Seed demo data (in production, fetch from Spring Boot API)
  self.records([
    {date:'2024-01-15',symbol:'AAPL',name:'Apple Inc.',type:'STOCK',action:'BUY',quantity:15,price:142.50},
    {date:'2024-02-03',symbol:'BTC',name:'Bitcoin',type:'CRYPTO',action:'BUY',quantity:0.5,price:42000},
    {date:'2024-02-20',symbol:'GOOGL',name:'Alphabet Inc.',type:'STOCK',action:'BUY',quantity:8,price:118.20},
    {date:'2024-03-10',symbol:'ETH',name:'Ethereum',type:'CRYPTO',action:'BUY',quantity:4,price:2200},
    {date:'2024-03-15',symbol:'MSFT',name:'Microsoft Corp.',type:'STOCK',action:'BUY',quantity:12,price:310},
    {date:'2024-04-01',symbol:'SOL',name:'Solana',type:'CRYPTO',action:'BUY',quantity:25,price:95},
    {date:'2024-05-22',symbol:'NVDA',name:'NVIDIA Corp.',type:'STOCK',action:'BUY',quantity:5,price:450},
    {date:'2024-06-10',symbol:'AAPL',name:'Apple Inc.',type:'STOCK',action:'SELL',quantity:5,price:185.20},
    {date:'2024-07-18',symbol:'SAVINGS',name:'High-Yield Savings',type:'CASH',action:'BUY',quantity:1,price:15000},
    {date:'2024-08-05',symbol:'BTC',name:'Bitcoin',type:'CRYPTO',action:'SELL',quantity:0.1,price:58000},
    {date:'2024-09-12',symbol:'CHECKING',name:'Checking Account',type:'CASH',action:'BUY',quantity:1,price:5200},
    {date:'2024-10-30',symbol:'ETH',name:'Ethereum',type:'CRYPTO',action:'BUY',quantity:2,price:2800},
  ]);
}

ko.applyBindings(new ArchivedRecordsViewModel());
