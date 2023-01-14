import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StudentsService } from 'src/app/api/students.service';
import { AttendanceStatus } from 'src/app/models/attendance-model';
import { StudentModel } from 'src/app/models/student';
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
    source: 'single' | 'group' | 'both' = 'both';
    sourceSelected: 'single' | 'group' = 'single';


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

    constructor(private studentsService: StudentsService,
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
            }

        })
    }

    onStudentAction(student: StudentModel) {
        student.isSelected = !student.isSelected;
    }

    select() {
        const selected = this.students.filter(x => x.isSelected);
        this.selectedChange.emit(selected);
        if (this.modal)
            this.modal.dismiss();
    }

}
