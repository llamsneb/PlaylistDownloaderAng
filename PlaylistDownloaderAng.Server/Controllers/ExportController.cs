using System;
using System.Linq;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using DocumentFormat.OpenXml;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json.Nodes;
using DocumentFormat.OpenXml.Drawing.Spreadsheet;

namespace PlaylistDownloaderAng.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ExportController : ControllerBase
    {
        //[HttpGet]
        //public string Get()
        //{
        //    return "Get Worked";
        //}

        [HttpPost]
        public IActionResult Post([FromBody]JsonObject playlist)
        {
            // create a new memory stream;
            MemoryStream ms = new MemoryStream();

            //string fileName = playlist["name"] + "_playlist.xlsx";

            // Create a spreadsheet document.  
            SpreadsheetDocument spreadsheetDocument = SpreadsheetDocument.
                Create(ms, SpreadsheetDocumentType.Workbook);

            // Add a WorkbookPart to the document.  
            WorkbookPart workbookpart = spreadsheetDocument.AddWorkbookPart();
            workbookpart.Workbook = new Workbook();

            // Add Styles
            WorkbookStylesPart stylesPart = workbookpart.AddNewPart<WorkbookStylesPart>();
            stylesPart.Stylesheet = CreateStyleSheet();
            stylesPart.Stylesheet.Save();

            // Add a WorksheetPart to the WorkbookPart.  
            WorksheetPart worksheetPart = workbookpart.AddNewPart<WorksheetPart>();
            worksheetPart.Worksheet = new Worksheet(new SheetData());

            // Add Sheets to the Workbook.  
            Sheets sheets = spreadsheetDocument.WorkbookPart.Workbook.AppendChild<Sheets>(new Sheets());

            //Append a new worksheet and associate it with the workbook.  
            Sheet sheet = new Sheet()
            {
                Id = spreadsheetDocument.WorkbookPart.
                GetIdOfPart(worksheetPart),
                SheetId = 1,
                Name = "Spotify"
            };
            sheets.Append(sheet);

            Worksheet worksheet = new Worksheet();
            SheetData sheetData = new SheetData();                       

            int tracks = playlist["tracks"]["total"].GetValue<int>();
            string[] SheetHeaders = ["Title", "Artist", "Album", "Time", "Date Added", "URL"];

            int rowId = 0;           
            Row row = new Row();
            for (int i = 0; i < SheetHeaders.Length; i++)
            {
                row.InsertAt<Cell>(
                    new Cell()
                    {
                        DataType = CellValues.InlineString,
                        InlineString = new InlineString() { Text = new Text(SheetHeaders[i]) },
                        StyleIndex = 1
                    }, i);
            }
            sheetData.InsertAt(row, rowId++);

            for (int i = 0; i < tracks; i++)
            {
                row = new Row();

                row.InsertAt<Cell>(new Cell()
                {
                    DataType = CellValues.InlineString,
                    InlineString = new InlineString() { Text = new Text(playlist["tracks"]["items"][i]["track"]["name"].GetValue<string>()) },
                }, 0);

                row.InsertAt<Cell>(new Cell()
                {
                    DataType = CellValues.InlineString,
                    InlineString = new InlineString() { Text = new Text(playlist["tracks"]["items"][i]["track"]["artists"][0]["name"].GetValue<string>()) },
                }, 1);

                row.InsertAt<Cell>(new Cell()
                {
                    DataType = CellValues.InlineString,
                    InlineString = new InlineString() { Text = new Text(playlist["tracks"]["items"][i]["track"]["album"]["name"].GetValue<string>()) },
                }, 2);

                int tracklength = (int)playlist["tracks"]["items"][i]["track"]["duration_ms"];
                string ts = TimeSpan.FromMilliseconds(tracklength).ToString();

                row.InsertAt<Cell>(new Cell()
                {
                    DataType = CellValues.Date,
                    CellValue = new CellValue(ts),
                    StyleIndex = 2
                }, 3);

                row.InsertAt<Cell>(new Cell()
                {
                    DataType = CellValues.InlineString,
                    InlineString = new InlineString() { Text = new Text(playlist["tracks"]["items"][i]["added_at"].GetValue<string>()) },
                }, 4);

                string cellAddress = "F" + (i + 1);                
                string uri = playlist["tracks"]["items"][i]["track"]["external_urls"]["spotify"].GetValue<string>();             

                row.InsertAt<Cell>(new Cell()
                {
                    CellFormula = new CellFormula(@"HYPERLINK(""" + uri + @""")"),
                }, 5);

                sheetData.InsertAt(row, rowId++);
            }
            Columns columns1 = AutoSizeCells(sheetData);
            worksheet.Append(columns1);
            worksheet.Append(sheetData);
            worksheetPart.Worksheet = worksheet;

            workbookpart.Workbook.Save();

            //Close the document.
            spreadsheetDocument.Dispose();

            // rewind the memory stream
            ms.Seek(0, SeekOrigin.Begin);

            // return the file stream
            return new FileStreamResult(ms, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");          

            //var stream = System.IO.File.Open(fileName, FileMode.Open);
            //return File(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);

            //return Ok(true);

        }

        Stylesheet CreateStyleSheet()
        {
            Stylesheet stylesheet = new Stylesheet();

            #region Number format
            uint DATETIME_FORMAT = 164;
            uint DIGITS4_FORMAT = 165;
            var numberingFormats = new NumberingFormats();
            numberingFormats.Append(new NumberingFormat // Datetime format
            {
                NumberFormatId = UInt32Value.FromUInt32(DATETIME_FORMAT),
                FormatCode = StringValue.FromString("dd/mm/yyyy hh:mm:ss")
            });
            numberingFormats.Append(new NumberingFormat // four digits format
            {
                NumberFormatId = UInt32Value.FromUInt32(DIGITS4_FORMAT),
                FormatCode = StringValue.FromString("0000")
            });
            numberingFormats.Count = UInt32Value.FromUInt32((uint)numberingFormats.ChildElements.Count);
            #endregion

            #region Fonts
            var fonts = new Fonts();
            fonts.Append(new DocumentFormat.OpenXml.Spreadsheet.Font()  // Font index 0 - default
            {
                FontName = new FontName { Val = StringValue.FromString("Calibri") },
                FontSize = new FontSize { Val = DoubleValue.FromDouble(11) }
            });
            fonts.Append(new DocumentFormat.OpenXml.Spreadsheet.Font()  // Font index 1
            {
                FontName = new FontName { Val = StringValue.FromString("Arial") },
                FontSize = new FontSize { Val = DoubleValue.FromDouble(11) },
                Bold = new Bold()
            });
            fonts.Count = UInt32Value.FromUInt32((uint)fonts.ChildElements.Count);
            #endregion

            #region Fills
            var fills = new Fills();
            fills.Append(new Fill() // Fill index 0
            {
                PatternFill = new PatternFill { PatternType = PatternValues.None }
            });
            fills.Append(new Fill() // Fill index 1
            {
                PatternFill = new PatternFill { PatternType = PatternValues.Gray125 }
            });
            fills.Append(new Fill() // Fill index 2
            {
                PatternFill = new PatternFill
                {
                    PatternType = PatternValues.Solid,
                    ForegroundColor = TranslateForeground(System.Drawing.Color.LightBlue),
                    BackgroundColor = new BackgroundColor { Rgb = TranslateForeground(System.Drawing.Color.LightBlue).Rgb }
                }
            });
            fills.Append(new Fill() // Fill index 3
            {
                PatternFill = new PatternFill
                {
                    PatternType = PatternValues.Solid,
                    ForegroundColor = TranslateForeground(System.Drawing.Color.LightSkyBlue),
                    BackgroundColor = new BackgroundColor { Rgb = TranslateForeground(System.Drawing.Color.LightBlue).Rgb }
                }
            });
            fills.Count = UInt32Value.FromUInt32((uint)fills.ChildElements.Count);
            #endregion

            #region Borders
            var borders = new Borders();
            borders.Append(new Border   // Border index 0: no border
            {
                LeftBorder = new LeftBorder(),
                RightBorder = new RightBorder(),
                TopBorder = new TopBorder(),
                BottomBorder = new BottomBorder(),
                DiagonalBorder = new DiagonalBorder()
            });
            borders.Append(new Border    //Boarder Index 1: All
            {
                LeftBorder = new LeftBorder { Style = BorderStyleValues.Thin },
                RightBorder = new RightBorder { Style = BorderStyleValues.Thin },
                TopBorder = new TopBorder { Style = BorderStyleValues.Thin },
                BottomBorder = new BottomBorder { Style = BorderStyleValues.Thin },
                DiagonalBorder = new DiagonalBorder()
            });
            borders.Append(new Border   // Boarder Index 2: Top and Bottom
            {
                LeftBorder = new LeftBorder(),
                RightBorder = new RightBorder(),
                TopBorder = new TopBorder { Style = BorderStyleValues.Thin },
                BottomBorder = new BottomBorder { Style = BorderStyleValues.Thin },
                DiagonalBorder = new DiagonalBorder()
            });
            borders.Count = UInt32Value.FromUInt32((uint)borders.ChildElements.Count);
            #endregion

            #region Cell Style Format
            var cellStyleFormats = new CellStyleFormats();
            cellStyleFormats.Append(new CellFormat  // Cell style format index 0: no format
            {
                NumberFormatId = 0,
                FontId = 0,
                FillId = 0,
                BorderId = 0,
                FormatId = 0
            });
            cellStyleFormats.Count = UInt32Value.FromUInt32((uint)cellStyleFormats.ChildElements.Count);
            #endregion

            #region Cell format
            var cellFormats = new CellFormats();
            cellFormats.Append(new CellFormat());    // Cell format index 0
            cellFormats.Append(new CellFormat   // CellFormat index 1
            {
                NumberFormatId = 0,        
                FontId = 1,
                FillId = 0,
                BorderId = 0,
                FormatId = 0,
                ApplyNumberFormat = BooleanValue.FromBoolean(true)
            });
            cellFormats.Append(new CellFormat   // Cell format index 2
            {
                NumberFormatId = 21, // 21   H:mm:ss
                FontId = 0,
                FillId = 0,
                BorderId = 0,
                FormatId = 0,
                ApplyNumberFormat = BooleanValue.FromBoolean(true)
            });
            #endregion

            stylesheet.Append(numberingFormats);
            stylesheet.Append(fonts);
            stylesheet.Append(fills);
            stylesheet.Append(borders);
            stylesheet.Append(cellStyleFormats);
            stylesheet.Append(cellFormats);


            #region Cell styles
            var css = new CellStyles();
            css.Append(new CellStyle
            {
                Name = StringValue.FromString("Normal"),
                FormatId = 0,
                BuiltinId = 0
            });
            css.Count = UInt32Value.FromUInt32((uint)css.ChildElements.Count);
            stylesheet.Append(css);
            #endregion

            return stylesheet;
        }

        ForegroundColor TranslateForeground(System.Drawing.Color fillColor)
        {
            return new ForegroundColor()
            {
                Rgb = new HexBinaryValue()
                {
                    Value =
                              System.Drawing.ColorTranslator.ToHtml(
                              System.Drawing.Color.FromArgb(
                                  fillColor.A,
                                  fillColor.R,
                                  fillColor.G,
                                  fillColor.B)).Replace("#", "")
                }
            };
        }

        Dictionary<int, int> GetMaxCharacterWidth(SheetData sheetData)
        {
            //iterate over all cells getting a max char value for each column
            Dictionary<int, int> maxColWidth = new Dictionary<int, int>();
            var rows = sheetData.Elements<Row>();
            UInt32[] numberStyles = new UInt32[] { 5, 6, 7, 8 }; //styles that will add extra chars
            UInt32[] boldStyles = new UInt32[] { 1, 2, 3, 4, 6, 7, 8 }; //styles that will bold
            foreach (var r in rows)
            {
                var cells = r.Elements<Cell>().ToArray();

                //using cell index as my column
                for (int i = 0; i < cells.Length; i++)
                {
                    var cell = cells[i];
                    var cellValue = cell.CellValue == null ? cell.InnerText : cell.CellValue.InnerText;
                    var cellTextLength = cellValue.Length;

                    if (cell.StyleIndex != null && numberStyles.Contains(cell.StyleIndex))
                    {
                        int thousandCount = (int)Math.Truncate((double)cellTextLength / 4);

                        //add 3 for '.00' 
                        cellTextLength += (3 + thousandCount);
                    }

                    if (cell.StyleIndex != null && boldStyles.Contains(cell.StyleIndex))
                    {
                        //add an extra char for bold - not 100% acurate but good enough for what i need.
                        cellTextLength += 1;
                    }

                    if (maxColWidth.ContainsKey(i))
                    {
                        var current = maxColWidth[i];
                        if (cellTextLength > current)
                        {
                            maxColWidth[i] = cellTextLength;
                        }
                    }
                    else
                    {
                        maxColWidth.Add(i, cellTextLength);
                    }
                }
            }

            return maxColWidth;
        }

        Columns AutoSizeCells(SheetData sheetData)
        {
            var maxColWidth = GetMaxCharacterWidth(sheetData);

            Columns columns = new Columns();
            //this is the width of my font - yours may be different
            double maxWidth = 7;
            foreach (var item in maxColWidth)
            {
                //width = Truncate([{Number of Characters} * {Maximum Digit Width} + {5 pixel padding}]/{Maximum Digit Width}*256)/256
                //width = Truncate([{Number of Characters} * {Maximum Digit Width}]/{Maximum Digit Width}*256)/256
                double width = Math.Truncate((item.Value * maxWidth) / maxWidth * 256) / 256;
                Column col = new Column() { BestFit = true, Min = (UInt32)(item.Key + 1), Max = (UInt32)(item.Key + 1), CustomWidth = true, Width = (DoubleValue)width };
                columns.Append(col);
            }

            return columns;
        }

        static public void InsertHyperLink(ref SpreadsheetDocument spreadsheetDocument, ref WorksheetPart worksheetPart, ref Worksheet worksheet, string uri, string cellAddress)
        {
            // Open the document for editing.  
            //using (SpreadsheetDocument spreadsheetDocument = SpreadsheetDocument.Open(fileName, true))
            //{
                // Get the first sheet in the workbook.  
                //Sheet sheet1 = spreadsheetDocument.WorkbookPart.Workbook.Descendants<Sheet>().First();
                //WorksheetPart worksheetPart = (WorksheetPart)spreadsheetDocument.WorkbookPart.GetPartById(sheet1.Id);

                // Create a hyperlink relationship.  
                HyperlinkRelationship hyperlinkRelationship = worksheetPart.AddHyperlinkRelationship(new System.Uri(uri, System.UriKind.Absolute), true);

                // Add a new shared string table part.  
                SharedStringTablePart sharedStringTablePart1;
                if (spreadsheetDocument.WorkbookPart.GetPartsOfType<SharedStringTablePart>().Count() > 0)
                {
                    sharedStringTablePart1 = spreadsheetDocument.WorkbookPart.GetPartsOfType<SharedStringTablePart>().First();
                }
                else
                {
                    sharedStringTablePart1 = spreadsheetDocument.WorkbookPart.AddNewPart<SharedStringTablePart>();
                }

            // Add a new shared string table.  
            SharedStringTable sharedStringTable1 = new SharedStringTable();
                    //{
                    //    Count = (UInt32Value)1U,
                    //    UniqueCount =
                    //    (UInt32Value)1U
                    //};
                sharedStringTablePart1.SharedStringTable = sharedStringTable1;

                // Create the hyperlink object.  
                Hyperlinks hyperlinks1 = new Hyperlinks();
                Hyperlink hyperlink1 =
                    new Hyperlink()
                    {
                        Reference = cellAddress,
                        Id = hyperlinkRelationship.Id
                    };

                // Append the hyperlink to the collection.   
                hyperlinks1.Append(hyperlink1);

                // Append the hyperlink to the worksheet.  
                worksheet.Append(hyperlinks1);
            }
        //}
    }
}
