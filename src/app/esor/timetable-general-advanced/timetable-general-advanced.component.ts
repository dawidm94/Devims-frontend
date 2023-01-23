import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {MatDialog} from "@angular/material/dialog";
import {FileService} from "../file.service";
import {HttpService} from "../http.service";
import {MatPaginator} from "@angular/material/paginator";
import {environment} from "../../../environments/environment";
import {MatchDetailsDialogComponent} from "../match-details-dialog/match-details-dialog.component";
import {AcceptNominationDialogComponent} from "../accept-nomination-dialog/accept-nomination-dialog.component";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-timetable-general-advanced',
  templateUrl: './timetable-general-advanced.component.html',
  styleUrls: ['./timetable-general-advanced.component.css']
})
export class TimetableGeneralAdvancedComponent implements OnInit {

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    public fileService: FileService,
    public httpService: HttpService) { }

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngOnInit(): void {
    this.updateTimetable();
  }

  isLoading = false;
  pageSizeOptions: number[] = [25, 50, 75, 100];
  teams: any;
  leagues: any[] = [];
  timetable: any | undefined;
  panelOpenState = false;
  baseUrl = environment.baseURL
  mobile = window.screen.width < 500;
  displayedColumns: string[] = this.mobile ? ['date', 'matchInfo', 'matchTeams', 'actions'] : ['date', 'matchInfo', 'matchTeams', 'actions'];
  displayedDictionaryColumns: string[] = ['example', 'description'];
  dictionaryData : any = [
    {example: 'brak', description: 'Wyświetla mecze, gdzie brakuje obsady.'},
    {example: 'zaakceptowana', description: 'Wyświetla mecze, gdzie wszyscy sędziowie zaakceptowali.'},
    {example: 'niekompletna', description: 'Wyświetla mecze, gdzie nie wszyscy sędziowie zaakceptowali.'},
    {example: 'niepotwierdzona', description: 'Wyświetla mecze, gdzie ktoś nie potwierdził nominacji.'},
    {example: 'boisko niepotwierdzona', description: 'Wyświetla mecze, gdzie ktoś na boisku nie potwierdził nominacji.'},
    {example: 'stolik niepotwierdzona', description: 'Wyświetla mecze, gdzie ktoś na stoliku nie potwierdził nominacji.'},
    {example: 'odrzucona', description: 'Wyświetla mecze, gdzie ktoś odrzucił nominację.'},
    {example: 'boisko odrzucona', description: 'Wyświetla mecze, gdzie ktoś na boisku odrzucił nominację.'},
    {example: 'stolik odrzucona', description: 'Wyświetla mecze, gdzie ktoś na stoliku odrzucił nominację.'}
  ];

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.timetable.filter = filterValue.trim().toLowerCase();

    if (this.timetable.paginator) {
      this.timetable.paginator.firstPage();
    }
  }

  updateTimetable() {
    this.isLoading = true
    let params = this.getAllTimetableParams();
    this.http.get<any>(this.baseUrl + 'esor/timetable', this.httpService.getOptionWithSeasonIdAndCustomParams(params)).subscribe({
      next: response => {
        this.timetable = new MatTableDataSource(response.items);

        this.timetable.data.forEach((match : any) => {
        match.refereesNames = this.getRefereesNames(match);
        match.refereesStatus = this.getRefereesStatus(match);
        });

        this.timetable.paginator = this.paginator;
        this.isLoading = false
      },
      error: err => {
        this.isLoading = false
        console.log(err)
      }
    })
  }

  private getAllTimetableParams() {
    let params = new HttpParams();
    params = params.append('page', 1);
    params = params.append('perPage', 1000);

    params = params.append('dateFrom', new Date().toISOString().split('T')[0]);
    return params;
  }

  getDelegation(match: any) {
    this.fileService.downloadDelegationWithFilename(match.id, match.date + '-' + match.teamHome)
  }

  getMetric(match: any) {
    this.fileService.downloadMetricWithFilename(match.id, match.date + '-' + match.teamHome)
  }

  openMatchDetailsDialog(matchId: number): void {
    let isMobile = window.screen.width < 500
    this.dialog.open(MatchDetailsDialogComponent, {
      width: '450px',
      height: isMobile ? (window.screen.height - 100) + 'px' : '',
      data: matchId
    });
  }

  getIcal(matchId: number) {
    this.fileService.downloadIcal(matchId);
  }

  editNomination(matchId: number) {
    let isMobile = window.screen.width < 500
    this.dialog.open(AcceptNominationDialogComponent, {
      width: '450px',
      height: isMobile ? (window.screen.height - 100) + 'px' : '',
      data: matchId
    }).afterClosed().subscribe()
  }

  getRefereeColor(status: any) {
    switch (status) {
      case -1:
      case '-1': {
        return 'color: red'
      }
      case 1:
      case '1': {
        return 'color: blue'
      }
      case 2:
      case '2': {
        return 'color: green'
      }
      default: {
        return 'color: black'
      }
    }
  }

  private getRefereesNames(match: any) {
    let refereesNames = '';
    match.referees.forEach((referee : any) => {
      refereesNames += referee.fullName + ' ';
    })
    match.tableReferees.forEach((referee : any) => {
      refereesNames += referee.fullName + ' ';
    })
    return refereesNames;
  }

  private getRefereesStatus(match: any) {
    let refereesStatus = '';

    refereesStatus += this.getStatus('BOISKO ', match.referees)
    refereesStatus += this.getStatus('STOLIK ', match.tableReferees)

    return refereesStatus == '' ? 'ZAAKCEPTOWANA' : refereesStatus;
  }

  private getStatus(refereeKind: string, referees: []) {
    if (referees.length == 0) {
      return 'BRAK '
    }
    let status = '';
    referees.forEach((referee : any) => {
      if (referee.status == '1' || referee.status == '-1') {
        status += 'NIEKOMPLETNA '
        if (referee.status == '1') {
          status += refereeKind
          status += 'NIEPOTWIERDZONA '
        }
        if (referee.status == '-1') {
          status += refereeKind
          status += 'ODRZUCONA '
        }
      }
    })
    return status;
  }
}

