import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {HttpService} from "../http.service";
import {MatTooltip} from "@angular/material/tooltip";

export interface RefereeData {
  id: string;
  imie: string;
  nazwisko: string;
  miasto: string;
  telefon: string;
  email: string;
  dystrykt: string;
}

@Component({
  selector: 'app-phonebook',
  templateUrl: './phonebook.component.html',
  styleUrls: ['./phonebook.component.css']
})
export class PhonebookComponent implements OnInit  {
  baseUrl = environment.baseURL
  mobile = window.screen.width < 500;

  displayedColumns: string[] = this.mobile ? ['nazwisko', 'imie', 'mobile-actions'] : ['nazwisko', 'imie', 'miasto', 'telefon', 'email'];
  dataSource: MatTableDataSource<RefereeData> | any;


  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;
  @ViewChild("myTooltip") myTooltip: MatTooltip | any

  constructor(
    private http: HttpClient,
    public httpService: HttpService
  ) { }

  ngOnInit(): void {
    this.getReferees();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  private getReferees() {
    this.http.get<any>(this.baseUrl + 'esor/referees', this.httpService.getOptionsWithSeasonId()).subscribe({
      next: response => {
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.data = response
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: err => {
        console.log(err)
      }
    })
  }

  copyEmail(id: any, index: number) {
    let obj = this.dataSource.data.find((data: { id: any; }) => {
      return data.id === id
    });
    let email = obj.email
    obj.email = '*Skopiowano*'
    let emailButton = document.getElementById('emailButton' + index);
    if (emailButton != null) {
      emailButton.setAttribute("disabled","disabled");
    }
    setTimeout(() => {
      obj.email = email
      if (emailButton != null) {
        emailButton.removeAttribute("disabled");
      }
    }, 300)
  }

  copyPhoneNumber(id: any, index: number) {
    let obj = this.dataSource.data.find((data: { id: any; }) => {
      return data.id === id
    });
    let phoneNumber = obj.telefon
    obj.telefon = '*Skopiowano*'
    let phoneNumberButton = document.getElementById('phoneNumberButton' + index);
    if (phoneNumberButton != null) {
      phoneNumberButton.setAttribute("disabled","disabled");
    }
    setTimeout(() => {
      obj.telefon = phoneNumber
      if (phoneNumberButton != null) {
        phoneNumberButton.removeAttribute("disabled");
      }
    }, 300)
  }
}
