const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');

// Route to add a new student
router.post('/add', async (req, res) => {
    try {
        const newStudent = new Student(req.body);
        await newStudent.save();
        res.status(201).send('Student added successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Route to get all students
router.get('/', async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Route to download student list as Excel
router.get('/download/excel', async (req, res) => {
    try {
        const students = await Student.find();

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Students');

        worksheet.columns = [
            { header: 'Name', key: 'name', width: 20 },
            { header: 'Year', key: 'year', width: 10 },
            { header: 'Branch', key: 'branch', width: 15 },
            { header: 'Section', key: 'section', width: 10 },
            { header: 'College Name', key: 'collegeName', width: 20 },
            { header: 'Gender', key: 'gender', width: 10 },
            { header: 'Mobile No.', key: 'mobileNo', width: 15 },
            { header: 'Email', key: 'email', width: 25 },
            { header: 'Payment', key: 'payment', width: 15 },
            { header: 'Transaction Id', key: 'transactionId', width: 20 } // Corrected header name
        ];

        students.forEach(student => {
            worksheet.addRow(student);
        });

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=' + 'students.xlsx'
        );

        return workbook.xlsx.write(res).then(() => {
            res.status(200).end();
        });

    } catch (error) {
        res.status(500).json({ error: 'An error occurred while generating the Excel file' });
    }
});

// Route to download student list as PDF
router.get('/download/pdf', async (req, res) => {
    try {
        const students = await Student.find();

        const doc = new PDFDocument();
        let filename = 'students.pdf';
        filename = encodeURIComponent(filename);

        res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-type', 'application/pdf');

        doc.fontSize(18).text('Student List', { align: 'center' });
        doc.moveDown();

        students.forEach((student, index) => {
            doc.fontSize(12).text(
                `${index + 1}. Name: ${student.name}, Year: ${student.year}, Branch: ${student.branch}, Section: ${student.section}, College Name: ${student.collegeName}, Gender: ${student.gender}, Mobile No: ${student.mobileNo}, Email: ${student.email}, Payment: ${student.payment}, Transaction Id: ${student.transactionId}`
            );
            doc.moveDown();
        });

        doc.pipe(res);
        doc.end();

    } catch (error) {
        res.status(500).json({ error: 'An error occurred while generating the PDF file' });
    }
});

// Route to delete a student
router.delete('/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) return res.status(404).json({ error: 'Student not found' });
        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the student' });
    }
});

module.exports = router;
