// class DataTable {
//     constructor(id) {
//         this.id = id;
//     }

//     update(data, columns) {
//         let table = d3.select(this.id);


//         let rows = table
//             .selectAll("tr")
//             .data(data)
//             .join("tr");

//         rows.selectAll("td")
//             .data(d => columns.map(c => d[c]))
//             .join("td")
//             .text(d => d)
//     }
// }

// class DataTable {
//     constructor(id) {
//       this.id = id;
//       this.sortColumn = null;
//       this.isAscending = true;
//     }
  
//     update(data, columns) {
//       const table = d3.select(this.id);
  
//       const rows = table
//         .selectAll('tr')
//         .data(data)
//         .join('tr');
  
//       rows
//         .selectAll('td')
//         .data(d => columns.map(c => d[c]))
//         .join('td')
//         .text(d => d)
//         .on('click', (d, i, nodes) => {
//           console.log(d, i, nodes);
//           const clickedColumn = columns[i];
//           console.log(columns, clickedColumn);
//           if (this.sortColumn === clickedColumn) {
//             this.isAscending = !this.isAscending;
//           } else {
//             this.sortColumn = clickedColumn;
//             this.isAscending = true;
//           }
  
//           this.sortTable(data);
//         });
//     }
  
//     sortTable(data) {
//       const column = this.sortColumn;
  
//       data.sort((a, b) => {
//         if (this.isAscending) {
//           return d3.ascending(a[column], b[column]);
//         } else {
//           return d3.descending(a[column], b[column]);
//         }
//       });
  
//       this.update(data, Object.keys(data[0]));
//     }
//   }

// class DataTable {
//   constructor(id, headid) {
//     this.id = id;
//     this.headid = headid;
//     this.isAscending = true;
//     this.sortedColumn = null;
//   }

//   update(data, columns) {
//     let table = d3.select(this.id);

//     let rows = table
//       .selectAll("tr")
//       .data(data)
//       .join("tr");

//     rows.selectAll("td")
//       .data(d => columns.map(c => d[c]))
//       .join("td")
//       .text(d => d)
//       .on("click", (event, d, nodes) => {
//         console.log(event.target.cellIndex, columns);
//         const column = columns[event.target.cellIndex];
//         this.sortTable(column);
//       });
//   }

//   sortTable(column) {
//     const table = d3.select(this.id);
//     const tbody = table.select("tbody");
//     const rows = tbody.selectAll("tr");

//     rows.sort((a, b) => {
//       if (this.isAscending) {
//         return d3.ascending(a[column], b[column]);
//       } else {
//         return d3.descending(a[column], b[column]);
//       }
//     });

//     this.isAscending = !this.isAscending;
//     this.sortedColumn = column;
//   }
// }

class DataTable {
  constructor(id, headid) {
    this.id = id;
    this.headid = headid;
    this.isAscending = true;
  }

  update(data, columns) {
    let table = d3.select(this.id);
    let header = d3.select(this.headid);

    header.selectAll("th").on("click", (event, d) => {
      console.log("asdsaasd", event.target, header);
      const column = columns[event.target.cellIndex];

      header.selectAll("span").remove();
      d3.select(event.target)
        .append("span")
        .text(() => {
          return this.isAscending ? "▲" : "▼";
        });

      this.sortTable(data, column);
      this.update(data, columns);
    });
    // .style("cursor", "pointer")
    //   .each((d, i, nodes) => {
    //     const column = d3.select(nodes[i]);
    //     console.log(d, i, nodes, column);
    //     column.selectAll("span").remove();
    //     column.append("span")
    //       .text(() => {
    //         return this.isAscending ? "▲" : "▼";
    //       });
    //   });

    let rows = table.selectAll("tr").data(data).join("tr");
    rows
      .selectAll("td")
      .data((d) => columns.map((c) => d[c]))
      .join("td")
      .text((d) => d);
  }

  sortTable(data, column) {
    const sortFn = this.isAscending ? d3.ascending : d3.descending;
    data.sort((a, b) => sortFn(a[column], b[column]));
    //this.changeHeader(column, this.isAscending);
    this.isAscending = !this.isAscending;
  }

  // changeHeader(column, isAsc) {
  //   console.log(column, isAsc, d3.select(this.headid).property());
  // }
}