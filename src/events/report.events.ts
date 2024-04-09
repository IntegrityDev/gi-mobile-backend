import { EventEmitter } from 'events';
import { Report } from '../database/models';
const reportEmitter = new EventEmitter();

reportEmitter.on("report-created",async (report: Report) => {
    
});

reportEmitter.on("author-commented",async () => {
    
});

reportEmitter.on("employee-commented",async () => {
    
});