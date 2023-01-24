import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClassService } from 'src/app/api/class.service';
import { StudentsService } from 'src/app/api/students.service';
import { AttendanceStatus } from 'src/app/models/attendance-model';
import { StudentModel } from 'src/app/models/student';
import { GroupModel } from 'src/app/models/student-group';
import { GlobalService } from 'src/app/services/global.service';

@Component({
    selector: 'app-select-student',
    templateUrl: './select-student.component.html',
    styleUrls: ['./select-student.component.scss'],
})
export class SelectStudentComponent implements OnInit {
    AttendanceStatus = AttendanceStatus;

    @Input()
    modal: any;

    @Input()
    source: 'student' | 'group' | 'both' = 'both';
    sourceSelected: 'student' | 'group' = 'student';

    @Input()
    selectionMode: 'multi' | 'single' = 'multi';

    @Input()
    viewMode: 'list' | 'grid' = 'grid';

    @Input()
    showConfirmButton = true;

    @Output()
    selectedChange = new EventEmitter<StudentModel[]>();

    @Input()
    selectedStudents: StudentModel[];

    @Input()
    disabledStudentIds: number[] = [];

    students: StudentModel[];
    groups: GroupModel[] = [];
    selectedGroup: GroupModel;

    constructor(private studentsService: StudentsService,
        private classService: ClassService,
        public globalService: GlobalService,) { }

    ngOnInit() {
        this.globalService.ready$.subscribe(ready => {
            if (ready) {
                this.studentsService.getStudentsOfClass(this.globalService.selectedClass.id).then(data => {
                    //Disconnecting student from originals
                    this.students = data.map(x => Object.assign(new StudentModel(), x));
                    if (this.selectedStudents)
                        this.selectedStudents.forEach(ss => {
                            const s = this.students.find(x => x.id == ss.id);
                            s.isSelected = true;
                        })
                });
                if (this.source != 'student')
                    this.classService.getGroups(this.globalService.selectedClass.id, undefined, undefined).then(data => {
                        this.groups = data;

                        if (this.groups.length > 0) {
                            this.selectedGroup = this.groups[this.groups.length - 1];//select latest group
                        }
                    })
            }

        })
    }

    onStudentAction(student: StudentModel) {
        student.isSelected = !student.isSelected;
    }

    select() {
        if (this.sourceSelected == 'student') {
            const selected = this.students.filter(x => x.isSelected);
            this.selectedChange.emit(selected);
        }
        else {
            const selected = this.selectedGroup.subGroups
                .filter(x => x.isSelected)
                .map(x => x.students)
                .reduce((old, current) => [...old, ...current], []);
            this.selectedChange.emit(selected);
        }
        if (this.modal)
            this.modal.dismiss();
    }

    onSelectStudent(student: StudentModel) {
        if (this.selectionMode == 'single') {
            this.selectedChange.emit([student]);
            if (this.modal)
                this.modal.dismiss();
        }
    }

}
