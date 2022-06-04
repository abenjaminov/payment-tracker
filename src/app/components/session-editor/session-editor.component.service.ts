import {Injectable} from "@angular/core";
import {ReplaySubject} from "rxjs";
import {Session} from "../../services/sessions.service";
import {SessionDay} from "../../models";


export class SessionEditorArgs {
  session?: Session;
  sessionDay: SessionDay
}

@Injectable({
  providedIn: 'root'
})
export class SessionEditorComponentService {
  onShowEditor: ReplaySubject<SessionEditorArgs> = new ReplaySubject<SessionEditorArgs>(1);
  onCloseEditor: ReplaySubject<void> = new ReplaySubject<void>(1);

  showEditor(args: SessionEditorArgs) {
    this.onShowEditor.next(args);
  }

  closeEditor() {
    this.onCloseEditor.next();
  }
}
