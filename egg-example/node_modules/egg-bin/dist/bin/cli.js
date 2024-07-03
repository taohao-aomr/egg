#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const artus_cli_1 = require("@artus-cli/artus-cli");
const isBuildJavascriptFile = __filename.endsWith('.js');
const exclude = ['scripts', 'bin', 'test', 'coverage'];
if (isBuildJavascriptFile) {
    exclude.push('*.ts');
}
else {
    exclude.push('dist');
}
(0, artus_cli_1.start)({ exclude });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Jpbi9jbGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsb0RBQTZDO0FBRTdDLE1BQU0scUJBQXFCLEdBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN6RCxNQUFNLE9BQU8sR0FBRyxDQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFVBQVUsQ0FBRSxDQUFDO0FBQ3pELElBQUkscUJBQXFCLEVBQUUsQ0FBQztJQUMxQixPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3ZCLENBQUM7S0FBTSxDQUFDO0lBQ04sT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN2QixDQUFDO0FBRUQsSUFBQSxpQkFBSyxFQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyJ9