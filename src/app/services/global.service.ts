import { AssessmentLevels, AssessmentModel, AssessParamterModel, ScoreAssessmentModel } from './../models/asses-param';
import { AuthService } from 'src/app/core/services/auth.service';
import { StudentReminder, LessonReminder, ReminderType, Reminder } from './../models/remider';
import { ReminderService } from './../api/reminder.service';
import { AttendanceModel, AttendanceStatus } from '../models/attendance-model';
import { ClassService } from './../api/class.service';
import { ScheduleTimeModel } from 'src/app/models/schedule';
import { Subject, BehaviorSubject, ReplaySubject, forkJoin } from 'rxjs';
import { Ring, Days, DateDay } from './../models/day';
import { Lesson } from 'src/app/models/lessons';
import { ClassModel, ClassSessionModel } from './../models/class';
import { StorageService } from './../core/services/storage.service';
import { Injectable } from '@angular/core';
import { ScheduleService } from '../api/schedule.service';
import { StudentsService } from '../api/students.service';
import { LessonService } from '../api/lesson.service';
import { StudentModel } from '../models/student';
import { AssessmentService } from '../api/assessment.service';
import { resolve } from 'dns';
import { ViewerModalComponent } from 'ngx-ionic-image-viewer';
import { ModalController } from '@ionic/angular';
import { Share } from '@capacitor/share';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Settings } from '../models/settings';
import { CancelOptions, LocalNotificationDescriptor, LocalNotifications } from '@capacitor/local-notifications';
import { TranslateService } from '@ngx-translate/core';
import { TranslateConfigService } from '../core/services/translate-config.service';
const CLASS_STORAGE = "CLASSAID_CLASS";

@Injectable({
    providedIn: 'root'
})
export class GlobalService {

    Settings_Storage = 'CLASSAID_Settings';

    public teacherId: number;
    public todayDay: number;
    public rings: Ring[];//Ring is diffrent for each school & grade (& maybe class)

    ready$ = new BehaviorSubject<boolean>(false);

    selectedClass$ = new BehaviorSubject<ClassModel>(null);

    public classSessions$ = new BehaviorSubject<ClassSessionModel[]>([]);
    public currentSession: ClassSessionModel | undefined;

    public todayShedules: ScheduleTimeModel[];
    public callRolling: AttendanceModel[];

    settings: Settings = new Settings();


    constructor(private storageService: StorageService,
        private studentsService: StudentsService,
        private authService: AuthService,
        private assessmentService: AssessmentService,
        private classService: ClassService,
        private reminderService: ReminderService,
        private studentService: StudentsService,
        public lessonService: LessonService,
        public modalController: ModalController,
        private translate: TranslateService,
        private translateConfigService: TranslateConfigService,
        private scheduleService: ScheduleService) {

        const user = authService.getProfile();

        if (user) {
            this.teacherId = authService.getProfile().id;
        }

        this.todayDay = (new Date().getDay() + 1) % 7;



        const settingJson = localStorage.getItem(this.Settings_Storage);
        if (settingJson)
            this.settings = JSON.parse(settingJson);

    }

    saveSetting() {
        localStorage.setItem(this.Settings_Storage, JSON.stringify(this.settings));
    }

    //When selectedClass is changed then rings & students must be reloaded
    public set selectedClass(vClass: ClassModel) {

        this.reminderService.getActiveClassReminders(vClass.id).then(x => {

        });
        //load students of the class
        //NOTE: getCallRolls will load all daysession callRollings(include all sessions) but order by time desc
        //--So last state of the attendance will be considered
        this.classService.getCallRolls(vClass.id).then(callRollings => {
            this.studentsService.getStudentsOfClass(vClass.id).then(students => {
                if (callRollings && callRollings.length > 0) {
                    students.forEach(student => {
                        //NOTE: will find last state of the students
                        const attendance = callRollings.find(x => x.studentId == student.id);
                        //TODO: handle if not foumd
                        student.attendanceStatus = attendance?.status;
                    });
                    this.studentsService.students$.next(students);
                }

            });
        });

        this.assessmentService.getParameters(0, vClass.gradeId).then(params => {

        })

        //Notes:
        //1. First Load Lessons of the Grade Of School
        //2. Load all sessions of the Class(Selected Class)
        //      2.1 fill book,lesson fields of each session
        //      2.2 Calc and apply sessions stats of each book to lessons
        //      2.3 find CurrentSession if exist and load its reminders
        //      2.4 Emit classSessions$ subject
        //3. Then load rings of Grade Of School(Event Class if reqiured) to load schdules
        //4. Load Schedules of the Class(Selected Class) Then:
        //      4.1 set Ring(object),Lesson(object) to each schedule by ringId,lessonId provided by prev steps
        //      4.2 filter Today Schedules
        //      4.3 Fill Today Schedules sessions


        this.lessonService.getBooks(vClass.schoolId, vClass.gradeId).then(books => {

            //2,3. Loading Rings
            Promise.all(
                [this.classService.getTodaySessionsByClass(vClass.id),
                this.classService.getAllSessionsByClass(vClass.id),
                this.scheduleService.getRings(vClass.schoolId, vClass.gradeId)])
                .then(async ([today_sessions, sessions, rings]) => {
                    //2.Step: 
                    await this.initSessionsAsync(vClass.id, today_sessions, sessions, books);

                    this.rings = rings;
                    //4. Loading Schedules
                    await this.loadSchedules(vClass.id, today_sessions);

                    this.selectedClass$.next(vClass);

                    ///--------------------------------- Init Days---------------------------
                    this.translateConfigService.initLanguage();
                    Days.push(<DateDay>{ no: 0, dayName: this.translate.instant('DAYS.SAT'), symbol: this.translate.instant('DAYS.SAT_SYMBOL') });
                    Days.push(<DateDay>{ no: 1, dayName: this.translate.instant('DAYS.SUN'), symbol: this.translate.instant('DAYS.SUN_SYMBOL') });
                    Days.push(<DateDay>{ no: 2, dayName: this.translate.instant('DAYS.MON'), symbol: this.translate.instant('DAYS.MON_SYMBOL') });
                    Days.push(<DateDay>{ no: 3, dayName: this.translate.instant('DAYS.TUE'), symbol: this.translate.instant('DAYS.TUE_SYMBOL') });
                    Days.push(<DateDay>{ no: 4, dayName: this.translate.instant('DAYS.WED'), symbol: this.translate.instant('DAYS.WED_SYMBOL') });
                    Days.push(<DateDay>{ no: 5, dayName: this.translate.instant('DAYS.THU'), symbol: this.translate.instant('DAYS.THU_SYMBOL') });
                    Days.push(<DateDay>{ no: 6, dayName: this.translate.instant('DAYS.FRI'), symbol: this.translate.instant('DAYS.FRI_SYMBOL') });


                    AssessmentLevels.push({ title: this.translate.instant('ASSESSMENT_LEVEL.EMPTY'), shortTitle: this.translate.instant('ASSESSMENT_LEVEL.EMPTY_SHORT'), value: 0, color: "#92949c", bdColor: "text-gray", ionColor: "medium", ionIcon: "" });
                    AssessmentLevels.push({ title: this.translate.instant('ASSESSMENT_LEVEL.L1'), shortTitle: this.translate.instant('ASSESSMENT_LEVEL.L1_SHORT'), value: 1, color: "#eb445a", bdColor: "text-danger", ionColor: "danger", ionIcon: "close-circle-outline" });
                    AssessmentLevels.push({ title: this.translate.instant('ASSESSMENT_LEVEL.L2'), shortTitle: this.translate.instant('ASSESSMENT_LEVEL.L2_SHORT'), value: 2, color: "#ffc409", bdColor: "text-warning", ionColor: "warning", ionIcon: "alert-circle-outline" });
                    AssessmentLevels.push({ title: this.translate.instant('ASSESSMENT_LEVEL.L3'), shortTitle: this.translate.instant('ASSESSMENT_LEVEL.L3_SHORT'), value: 3, color: "#4E7DF1", bdColor: "text-primary", ionColor: "secondary", ionIcon: "checkmark-circle-outline" });
                    AssessmentLevels.push({ title: this.translate.instant('ASSESSMENT_LEVEL.L4'), shortTitle: this.translate.instant('ASSESSMENT_LEVEL.L4_SHORT'), value: 4, color: "#2dd36f", bdColor: "text-success", ionColor: "success", ionIcon: "checkmark-done-circle-outline" });
                    this.ready$.next(true);
                });
        });

    }
    public get selectedClass() {
        return this.selectedClass$.value;
    }

    public get sessions() {
        return this.classSessions$.value;
    }

    async loadSchedules(classId: number, today_sessions) {
        return this.scheduleService.get(classId).then(schdule => {
            if (schdule) {
                schdule.scheduleTimes.forEach(st => {
                    st.ring = this.rings.find(x => x.id == st.ringId);
                    //lessonService.books$ filled when getBooks called
                    st.lesson = this.lessonService.books$.value.find(x => x.id == st.lessonId);
                });

                //4.2 Clone the schedules to make it non-changable
                this.todayShedules = [...schdule.scheduleTimes.filter(x => x.dayNo == this.todayDay)];
                if (today_sessions)
                    this.todayShedules.forEach(sch => {
                        //4.3 
                        sch.session = today_sessions.find(x => x.scheduleTimeId == sch.id);
                    })
            }
        });

    }

    async initSessionsAsync(classId, today_sessions: ClassSessionModel[], sessions2: ClassSessionModel[], books: Lesson[]): Promise<boolean> {
        return new Promise(async resolve => {
            sessions2.forEach(s => {
                s.startTime = new Date(s.startTime);
                s.book = books.find(x => x.id == s.lessonId);
                s.lesson = this.lessonService.allLessons$.value.find(x => x.id == s.subLessonId);
            });
            today_sessions.forEach(s => {
                s.avgAssessMeasure = this.findLevelByValue(s.averageAssessment);
                s.book = books.find(x => x.id == s.lessonId);
                s.lesson = this.lessonService.allLessons$.value.find(x => x.id == s.subLessonId);
            });
            //2.2 Proccesing and applying stats of each lesson
            this.initBooks(books, sessions2);

            //2.3 find currentSession and its reminders
            this.currentSession = sessions2.find(x => x.endTime == null);

            if (this.currentSession) {
                await this.initCurrentSessionAsync(sessions2, classId);
            }
            else

                this.classSessions$.next(sessions2);

            return resolve(true);
        });

    }

    initBooks(books: Lesson[], sessions: ClassSessionModel[]) {
        books.forEach(b => {
            const book_sessions = sessions.filter(x => x.lessonId == b.id);
            //b.sessions = this.sessions.filter(x => x.lessonId == b.id);
            b.sessionsCount = book_sessions.length;
            if (book_sessions.length > 0) {
                const lastLessonId = book_sessions[book_sessions.length - 1].subLessonId;
                b.lastSessionLesson = this.lessonService.allLessons$.value.find(x => x.id == lastLessonId);
            }

        });
    }

    async initCurrentSessionAsync(sessions: ClassSessionModel[], classId) {
        return Promise.all(
            [this.reminderService.getSessionReminders(this.currentSession.id),
            this.assessmentService.getSessionAssessments(this.currentSession.id),
            this.classService.getLessonHomeWorks(this.currentSession.lessonId, classId)])
            .then(([reminders, assessments, homeWorks]) => {
                this.currentSession.reminders = reminders;
                this.currentSession.assessments = assessments.filter(x => x.level > 0);
                this.currentSession.scores = assessments.filter(x => x.level == 0).map(x => x as ScoreAssessmentModel);
                this.currentSession.homeWorks = homeWorks;
                this.classSessions$.next(sessions);
            });

    }


    startClass(session: ClassSessionModel): Promise<boolean> {
        return new Promise((resolve, reject) => {
            session.classId = this.selectedClass.id;
            this.classService.addTask(session).then(result => {
                if (!result) {
                    reject(false);
                    return;
                }


                //To prevent circular reference in saving to storage(no lesson stats)
                const raw_session = { ...session };
                raw_session.book = null;
                raw_session.lesson = null;

                this.currentSession = session;

                //Updating Schdules
                if (session.scheduleTimeId)
                    this.todayShedules.find(x => x.id == session.scheduleTimeId).session = session;
                //lesson filled in Class.ts(caller)
                session.book.sessionsCount += 1;
                session.book.lastSessionLesson = this.lessonService.allLessons$.value.find(x => x.id == session.subLessonId);

                this.classSessions$.next([...this.sessions, session]);

                this.storageService.saveStorage(CLASS_STORAGE, JSON.stringify(raw_session));

                this.classService.getLessonHomeWorks(this.currentSession.lessonId, this.selectedClass.id)
                    .then(homeWorks => {
                        this.currentSession.homeWorks = homeWorks;
                    });

                LocalNotifications.schedule({
                    notifications: [
                        {
                            title: "پایان کلاس",
                            body: "کلاس درس " + session.book.name + " به پایان رسید، لطفا در انتهای کلاس دکمه اتمام را بفشارید",
                            id: 300,
                            sound: "beep.wav",
                            schedule: {
                                repeats: true,
                                every: 'minute',
                                count: 3,//every 3 mintues after schedule at
                                at: new Date(Date.now() + 1000 * 60 * 5)//find 45 from schedule time or manual session time
                            }
                        }
                    ]
                });
                resolve(true);
            })
        })


    }

    endClass() {
        this.classService.endTask(this.currentSession.id).then(result => {
            this.currentSession.endTime = new Date();
            const ts = this.todayShedules.find(x => x.id == this.currentSession.scheduleTimeId);
            if (ts)
                if (ts.session)
                    ts.session.endTime = new Date();
            this.currentSession = undefined;

            this.storageService.removeStorage(CLASS_STORAGE);

            this.classSessions$.next(this.sessions);

            LocalNotifications.cancel(<CancelOptions>{
                notifications: [
                    <LocalNotificationDescriptor>{ id: 300 }
                ]
            });
        });
    }

    findLevelByValue(value: number) {
        return AssessmentLevels.find(x => x.value == Math.ceil(value))
    }

    cloneArray(array: any[]) {
        return JSON.parse(JSON.stringify(array));
    }

    async openImageViewer(imageUrl: string) {
        const modal = await this.modalController.create({
            component: ViewerModalComponent,
            componentProps: {
                src: imageUrl
            },
            cssClass: 'ion-img-viewer',
            keyboardClose: true,
            showBackdrop: true
        });

        return await modal.present();
    }

    async shareData(title: string, text: string, fileUrl?: string) {

        let permission = await Filesystem.checkPermissions();
        if (permission.publicStorage !== "granted") {
            console.log("permission is required");
            permission = await Filesystem.requestPermissions() // Why this doesn't work????

            if (permission.publicStorage !== "granted") {
                return
            }
        }


        if (fileUrl) {
            console.log("Has File");
            let blob = undefined;
            const fileName = fileUrl;
            //Download file

            var xhr = new XMLHttpRequest();
            xhr.open('GET', fileUrl, true);
            xhr.responseType = 'blob';
            const me = this;
            xhr.onload = function (e) {
                console.log("Blob download");
                if (this.status !== 200) return;
                console.log("Blob Success");
                let blob = new Blob([this.response], { type: this.response.type });
                //Conver Blob
                const reader = me.getFileReader();

                reader.onloadend = async () => {
                    const filedata = reader.result;
                    console.log("Blob Read");
                    try {
                        console.log("Writing Blob to cache");
                        await Filesystem.writeFile({
                            path: fileName,
                            data: filedata as string,
                            directory: Directory.Cache,
                            recursive: true
                        });

                        let fileResult = await Filesystem.getUri({
                            directory: Directory.Cache,
                            path: fileName
                        });
                        console.log("Reading uri: " + fileResult.uri);
                        await Share.share({
                            title: title,
                            text: text,
                            url: fileResult.uri,
                            dialogTitle: 'اشتراک گزارش',
                        });

                    } catch (e) {
                        console.error('Unable to write file', e);
                    }
                };
                reader.readAsDataURL(blob);
            };
            xhr.send();
        }
        else
            await Share.share({
                title: title,
                text: text,
                //url: environment.imageUrl + '/' + note.images[0],
                dialogTitle: 'اشتراک گزارش',
            });
    }

    getFileReader(): FileReader {
        const fileReader = new FileReader();
        const zoneOriginalInstance = (fileReader as any)["__zone_symbol__originalInstance"];
        return zoneOriginalInstance || fileReader;
    }

    resetData() {
        this.storageService.removeStorage(CLASS_STORAGE);
        this.classSessions$.next([]);
        this.callRolling = [];
        this.currentSession = undefined;
        this.selectedClass$.next(undefined);
        this.rings = [];
        this.lessonService.reset();
        this.assessmentService.reset();
        this.studentService.reset();
        this.classService.reset();
        this.reminderService.reset();
    }
}
