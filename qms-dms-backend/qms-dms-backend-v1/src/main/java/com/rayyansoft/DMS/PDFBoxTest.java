package com.rayyansoft.DMS;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;

import java.io.File;
import java.io.IOException;

public class PDFBoxTest {


    public static void main(String[] args) {
        String filePath = "D:/Uploads/a0c5793c-fc89-450c-80a4-4781a29883c7_JCI  MOI 1 plan.pdf"; // Path to your test PDF
        try (PDDocument document = PDDocument.load(new File(filePath))) {
            PDFTextStripper pdfStripper = new PDFTextStripper();
            String extractedText = pdfStripper.getText(document);
            System.out.println("Extracted Text: " + extractedText);
        } catch (IOException e) {
            System.err.println("Error loading or parsing PDF with PDFBox: " + e.getMessage());
        }
    }
}
