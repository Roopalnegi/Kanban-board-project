package com.kanbanServices.boardServices.execption;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.NOT_FOUND)
public class ColumnNotFoundException extends RuntimeException {
    public ColumnNotFoundException(String message) {
        super(message);
    }
}
/*When updating/deleting non-existing column	"Column 'QA Testing' not found"
 404(not found) code will appear with message column not found */