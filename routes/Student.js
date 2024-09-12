const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');

// Route to add a new student
router.post('/add', async (req, res) => {
    try {
        const newStudent = new Student(req.body);

        // Validate required fields (e.g. name, email, etc.)
        if (!newStudent.name || !newStudent.email) {
            return res.status(400).send('Name and Email are required');
        }

        await newStudent.save();
        res.status(201).json({ message: 'Student added successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route to get all students
router.get('/', async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to download student list as Excel
router.get('/download/excel', async (req, res) => {
    try {
        const students = await Student.find();

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Students');

        // Define the columns for the worksheet
        worksheet.columns = [
            { header: 'Name', key: 'name', width: 20 },
            { header: 'Year', key: 'year', width: 10 },
            { header: 'Branch', key: 'branch', width: 15 },
            { header: 'RegNo', key: 'regno', width: 10 },
            { header: 'College Name', key: 'collegeName', width: 20 },
            { header: 'Team Name', key: 'teamName', width: 20 },
            { header: 'T-shirt Size', key: 'tshirt', width: 20 },
            { header: 'Team Leader Regno', key: 'teamregno', width: 20 },
            { header: 'Gender', key: 'gender', width: 10 },
            { header: 'Mobile No.', key: 'mobileNo', width: 15 },
            { header: 'Email', key: 'email', width: 25 },
            { header: 'Payment', key: 'payment', width: 15 },
            { header: 'Transaction ID', key: 'transactionId', width: 20 },
        ];

        // Add rows to the worksheet
        students.forEach(student => {
            worksheet.addRow({
                name: student.name,
                year: student.year,
                branch: student.branch,
                regno: student.regno,
                collegeName: student.collegeName,
                teamName: student.teamName,
                tshirt: student.tshirt,
                teamregno: student.teamregno,
                gender: student.gender,
                mobileNo: student.mobileNo,
                email: student.email,
                payment: student.payment,
                transactionId: student.transactionId,
            });
        });

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=students.xlsx'
        );

        // Send the Excel file as a response
        await workbook.xlsx.write(res);
        res.status(200).end();

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

        // Formatting each student's data in a readable format
        students.forEach((student, index) => {
            doc.fontSize(12).text(`${index + 1}. Name: ${student.name}`);
            doc.text(`Year: ${student.year}, Branch: ${student.branch}`);
            doc.text(`College: ${student.collegeName}, Team: ${student.teamName}`);
            doc.text(`Email: ${student.email}, Mobile: ${student.mobileNo}`);
            doc.text(`Gender: ${student.gender}, Payment: ${student.payment}`);
            doc.text(`Transaction ID: ${student.transactionId}`);
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
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the student' });
    }
});

module.exports = router;
