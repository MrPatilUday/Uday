import { Component, OnInit, AfterViewChecked, AfterViewInit, Input, ViewChild, ElementRef } from '@angular/core';
import { DataService } from './data.service';
import { TempData } from './temp-data.model';
import * as XLSX from 'xlsx';
import { CsvDataService } from './csv-data.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'CustomTable';
  boolSort: boolean;
  originalData: TempData[];
  filteredData: TempData[];
  reportLines: any;
  currentPage: number;
  lastValue: number;
  startValue: number;
  lastPage: number;
  veryLastValue: number;
  isPrevDisabled: boolean;
  isLastDisabled: boolean;
  firstNameFiltered: TempData[];
  lastNameFiltered: TempData[];
  genderFiltered: TempData[];
  emailFiltered: TempData[];
  totalPages: number;
  imagePath: string;
  pageSize: number = 10;

  getData: TempData[] = [{
    email: null,
    first_name: null,
    gender: null,
    id: null,
    last_name: null
  }];


  @ViewChild('first_name') first_name: ElementRef;
  @ViewChild('last_name') last_name: ElementRef;
  @ViewChild('gender') gender: ElementRef;
  @ViewChild('email') email: ElementRef;
  @ViewChild('id') id: ElementRef;
  @ViewChild('globalFilter') globalFilter: ElementRef;
  @ViewChild('tbldata') tbldata: ElementRef;



  fileName = 'ExcelSheet.xlsx';

  exportToExcel(): void {
    console.log(this.tbldata);
    /* table id is passed over here */
    let element = document.getElementById('infoTable');
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filteredData);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

  }


  constructor(private dataservice: DataService, private csvService: CsvDataService) {

  }

  ngOnInit() {
    this.boolSort = true;
    this.dataservice.displayData().subscribe(x => {
      this.getData = x;
      this.originalData = x;
      this.filteredData = x;
      this.currentPage = 1;
      this.startValue = 0;
      this.lastValue = this.pageSize;
      this.isPrevDisabled = true;
      this.imagePath = "./assets/Ascending.png"

      this.getData = this.getData.slice(0, this.pageSize);
      this.lastPage = Math.floor(this.filteredData.length / this.pageSize);
      this.totalPages = Math.floor(this.filteredData.length / this.pageSize);
      this.veryLastValue = this.filteredData.length - this.pageSize;

    });

    console.log(this.getData);

  }

  sort(columnName: string) {

    this.boolSort = !this.boolSort;

    if (this.boolSort) {
      this.imagePath = "./assets/Ascending.png"
    } else {
      this.imagePath = "./assets/Descending.png"
    }

    console.log(this.boolSort);
    console.log(columnName);
    if (this.boolSort) {
      this.getData = this.filteredData.sort((a, b) => {

        if (typeof (a[columnName]) == 'number') {
          return a[columnName] - b[columnName];
        }
        return a[columnName].localeCompare(b[columnName]);
      });

    }

    else {
      this.getData = this.filteredData.sort((a, b) => {
        if (typeof (a[columnName]) == 'number') {
          return b[columnName] - a[columnName];
        }
        return b[columnName].localeCompare(a[columnName]);
      });

    }
    this.getData = this.getData.slice(this.startValue, this.pageSize);
    //this.isPrevDisabled = true;
    this.isLastDisabled = false;
    if (this.filteredData.length == 0) {
      this.isLastDisabled = true;
    }

    if (this.currentPage == this.totalPages) {
      this.isLastDisabled = true;
    }


  }

  filter(columnName: string, criteria: string) {
    //console.log(criteria);
    //console.log(this.nameInputRef.nativeElement.value);

    this.globalFilter.nativeElement.value = null;
    this.filteredData = Object.assign(this.originalData);




    if (this.id.nativeElement.value) {
      this.filteredData = this.filteredData.filter((x) => {
        return x['id'] == (this.id.nativeElement.value);
      })
    }


    this.filteredData = this.filteredData.filter((x) => {
      return x['first_name'].toLowerCase().indexOf(this.first_name.nativeElement.value) > -1;
    })

    this.filteredData = this.filteredData.filter((x) => {
      return x['last_name'].toLowerCase().indexOf(this.last_name.nativeElement.value) > -1;
    })

    this.filteredData = this.filteredData.filter((x) => {
      return x['gender'].toLowerCase().indexOf(this.gender.nativeElement.value) > -1;
    })

    this.filteredData = this.filteredData.filter((x) => {
      return x['email'].toLowerCase().indexOf(this.email.nativeElement.value) > -1;
    })




    this.getData = this.filteredData;
    this.getData = this.getData.slice(this.startValue, this.pageSize);

    this.isPrevDisabled = true;
    this.isLastDisabled = false;

    if (this.filteredData.length == 0) {
      this.isLastDisabled = true;
      this.totalPages = 0;
      this.currentPage = 0;
    }
    else {
      this.currentPage = 1;
      this.lastPage = Math.floor(this.filteredData.length / this.pageSize);
      this.totalPages = Math.floor(this.filteredData.length / this.pageSize);
      if (this.lastPage == 0 || this.totalPages == 0) {
        this.lastPage = 1;
        this.totalPages = 1;
      }
      if (this.totalPages == this.currentPage) {

        this.isLastDisabled = true;

      }
    }



    console.log(this.filteredData);

  }


  saveAsCSV() {
    if (this.filteredData.length > 0) {
      const items: TempData[] = [];

      this.filteredData.forEach(line => {
        //let reportDate = new Date(report.date);
        let csvLine: TempData = {
          //date: `${reportDate.getDate()}/${reportDate.getMonth()+1}/${reportDate.getFullYear()}`,
          // laborerName: line.laborerName,
          // machineNumber: line.machineNumber,
          // machineName: line.machineName,
          // workingHours: line.hours,
          // description: line.description
          id: line.id,
          first_name: line.first_name,
          last_name: line.last_name,
          gender: line.gender,
          email: line.email,

        }
        items.push(csvLine);
      });

      this.csvService.exportToCsv('myCsvDocumentName.csv', items);
    }

  }


  printTable() {

    window.print();

  }

  copytable(el) {
    var urlField = document.getElementById(el)
    var range = document.createRange()
    range.selectNode(urlField)
    window.getSelection().addRange(range)
    document.execCommand('copy')
  }

  onPageChange(pageNo: number) {
    console.log("Current page: ", pageNo);
  }

  nextPage(currentPage: number, lastValue: number) {

    this.getData = this.filteredData.slice(lastValue, lastValue + this.pageSize);
    this.currentPage = this.currentPage + 1;
    this.lastValue = this.lastValue + this.pageSize;
    this.isPrevDisabled = false;

    this.totalPages = Math.floor(this.filteredData.length / this.pageSize);

    if (currentPage == this.totalPages - 1) {
      this.isLastDisabled = true;
    }



  }

  lstPage() {

    this.lastPage = Math.floor(this.filteredData.length / this.pageSize);
    this.totalPages = Math.floor(this.filteredData.length / this.pageSize);
    this.veryLastValue = this.filteredData.length;
    this.currentPage = this.lastPage;
    this.lastValue = this.veryLastValue;
    this.getData = this.filteredData.slice(this.lastValue - this.pageSize, this.lastValue);

    this.isPrevDisabled = false;
    this.isLastDisabled = true;
  }

  previousPage(currentPage: number, lastValue: number) {

    this.getData = this.filteredData.slice(lastValue - 20, lastValue - this.pageSize);
    this.currentPage = this.currentPage - 1;
    this.lastValue = this.lastValue - this.pageSize;

    if (currentPage == 2) {
      this.isPrevDisabled = true;
    }

    this.isLastDisabled = false;



  }

  firstPage() {
    this.currentPage = 1;
    this.lastValue = this.pageSize;
    this.getData = this.filteredData.slice(this.lastValue - this.pageSize, this.lastValue);
    this.isPrevDisabled = true;
    this.isLastDisabled = false;
  }

  globalFilterMethod(criteria: string) {

    this.id.nativeElement.value = null;
    this.first_name.nativeElement.value = null;
    this.last_name.nativeElement.value = null;
    this.gender.nativeElement.value = null;
    this.email.nativeElement.value = null;

    this.firstNameFiltered = this.originalData.filter((a) => {

      return a['first_name'].toLowerCase().indexOf(criteria.toLowerCase()) > -1;

    });

    this.lastNameFiltered = this.originalData.filter((a) => {

      return a['last_name'].toLowerCase().indexOf(criteria.toLowerCase()) > -1;

    });

    this.genderFiltered = this.originalData.filter((a) => {

      return a['gender'].toLowerCase().indexOf(criteria.toLowerCase()) > -1;

    });

    this.emailFiltered = this.originalData.filter((a) => {

      return a['email'].toLowerCase().indexOf(criteria.toLowerCase()) > -1;

    });

    this.filteredData = [...new Set([...this.firstNameFiltered, ...this.lastNameFiltered, ...this.genderFiltered, ...this.emailFiltered])];
    this.getData = this.filteredData.slice(0, this.pageSize);
    this.isPrevDisabled = true;
    this.isLastDisabled = false;
    if (this.filteredData.length == 0) {
      this.lastPage = 0;
      this.totalPages = 0;
      this.currentPage = 0;
    } else {


      this.currentPage = 1;
      this.lastPage = Math.floor(this.filteredData.length / this.pageSize);
      this.totalPages = Math.floor(this.filteredData.length / this.pageSize);
      if (this.lastPage == 0 || this.totalPages == 0) {
        this.lastPage = 1;
        this.totalPages = 1;
      }
      if (this.totalPages == this.currentPage) {

        this.isLastDisabled = true;

      }

    }





  }

}
