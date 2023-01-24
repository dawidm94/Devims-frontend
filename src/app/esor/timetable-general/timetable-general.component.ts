import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {MatDialog} from "@angular/material/dialog";
import {FileService} from "../file.service";
import {HttpService} from "../http.service";
import {environment} from "../../../environments/environment";
import {MatchDetailsDialogComponent} from "../match-details-dialog/match-details-dialog.component";
import {AcceptNominationDialogComponent} from "../accept-nomination-dialog/accept-nomination-dialog.component";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {DOCUMENT} from "@angular/common";

@Component({
  selector: 'app-timetable-general',
  templateUrl: './timetable-general.component.html',
  styleUrls: ['./timetable-general.component.css']
})
export class TimetableGeneralComponent implements OnInit {

  isLoading = false;
  totalRows = 0;
  pageSize = 25;
  currentPage = 0;
  pageSizeOptions: number[] = [25, 50, 75, 100];
  teams: any;
  leagues: any[] = [];
  panelOpenState = false;
  timetable: any | undefined;
  baseUrl = environment.baseURL
  mobile = window.screen.width < 500;
  displayedColumns: string[] = this.mobile ? ['date', 'matchInfo', 'matchTeams', 'actions'] : ['date', 'matchInfo', 'matchTeams', 'actions'];
  showGoToTopButton = false;

  //filter
  city = '';
  fromDate: any = new Date()
  toDate = '';
  finished = '';
  homeTeamId = '';
  visitorTeamId = '';
  leagueId = '';

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    public fileService: FileService,
    public httpService: HttpService,
    @Inject(DOCUMENT) private document: Document) { }

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngOnInit(): void {
    this.getTeams();
    this.updateTimetable();
  }

  updateTimetable() {
    this.isLoading = true
    let params = this.getParams();
    this.http.get<any>(this.baseUrl + 'esor/timetable', this.httpService.getOptionWithSeasonIdAndCustomParams(params)).subscribe({
      next: response => {
        this.isLoading = false
        this.timetable = response.items
        this.timetable.paginator = this.paginator;
        setTimeout(() => {
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = response.pagination.total;
        });
      },
      error: err => {
        this.isLoading = false
        console.log(err)
      }
    })
  }

  private getTeams() {
    this.http.get<any>(this.baseUrl + 'esor/teams', this.httpService.getOptionsWithSeasonId()).subscribe({
      next: response => {
        this.teams = response
        let leaguesIdInSet = new Set;
        response.forEach((team: any) => {
          team.leagues.forEach((league :any) => {
            if (!leaguesIdInSet.has(league.id)) {
              this.leagues.push(league);
              leaguesIdInSet.add(league.id)
            }
          })
        })
      },
      error: err => {
        console.log(err)
      }
    })
  }

  pageChanged(event: PageEvent) {
    console.log({ event });
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updateTimetable();
  }

  private getParams() {
    let params = new HttpParams();
    params = params.append('page', this.currentPage + 1);
    params = params.append('perPage', this.pageSize);

    if (this.fromDate && this.fromDate != '') {
      params = params.append('dateFrom', (this.fromDate as unknown as Date).toISOString().split('T')[0]);
    }

    if (this.toDate && this.toDate != '') {
      params = params.append('dateTo', (this.toDate as unknown as Date).toISOString().split('T')[0]);
    } else {
      params = params.append('dateTo', this.toDate)
    }

    if (this.homeTeamId && this.homeTeamId != '') {
      params = params.append('homeId', this.homeTeamId);
    }

    if (this.visitorTeamId && this.visitorTeamId != '') {
      params = params.append('visitorId', this.visitorTeamId);
    }
    if (this.leagueId && this.leagueId != '') {
      params = params.append('leagueId', this.leagueId);
    }
    if (this.finished && this.finished != '') {
      params = params.append('finished', this.finished);
    }
    if (this.city && this.city != '') {
      params = params.append('city', this.city);
    }
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

  clearAllFilters() {
    this.city = '';
    this.fromDate = '';
    this.toDate = '';
    this.finished = '';
    this.homeTeamId = '';
    this.visitorTeamId = '';
    this.leagueId = '';
    this.finished = '';
  }

  scrollToTop(): void {
    return this.document.body.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'start'
    });
  }
}
